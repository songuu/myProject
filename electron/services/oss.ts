import shortid from 'shortid'

import Qiniu from './qiniu'

import TaskRunnerService from './TaskRunnerService'

import AppStoreService from './appStore'

import TransferStoreService from './TransferStoreService'

import {
  IOSS,
  IOssService,
  OssType,
  IStore,
  AppStore,
  ITaskRunner,
  TaskType,
  TransferStore,
  TransferStatus,
  Task,
} from './interface'

import { configStore } from './config'

import { emitter, fattenFileList } from '../helper/utils'

import fs, { Stats } from 'fs'

const path = require('path')

function pathStatsSync(path: string): Stats {
  return fs.statSync(path)
}

class OssService implements IOssService {
  public instance: IOSS | null = null

  public static create(type: OssType, ak: string, sk: string): IOSS {
    switch (type) {
      case OssType.qiniu:
        return new Qiniu(ak, sk)
      /* case OssType.ali:
        return new Ali(ak, sk)
      case OssType.tencent:
        return new Tencent(ak, sk) */
      default:
        throw Error('暂时还不支持该云存储厂商')
    }
  }

  getService(): IOSS {
    if (!this.instance) {
      throw new Error('没有初始化 app')
    }
    return this.instance
  }

  changeContext(type: OssType, ak: string, sk: string) {
    this.instance = OssService.create(type, ak, sk)
  }

  clearContext() {
    this.instance = null
  }
}

class IpcChannelsService {
  private appStore: IStore<AppStore> = new AppStoreService()

  private transferStore: IStore<TransferStore> = new TransferStoreService()

  private oss: IOssService = new OssService()

  private taskRunner: ITaskRunner | null = null

  constructor() {
    this.taskRunner = new TaskRunnerService()
  }

  getOss = () => this.oss

  async initApp(params: any) {
    let finallyApp: AppStore
    if (params.id) {
      // 传入 id 证明用户选择了 id
      const findApps = await this.appStore.find({ _id: params.id })

      if (findApps.length <= 0) throw new Error('没有可初始化的 app')
      ;[finallyApp] = findApps
    } else {
      // 软件初始化
      const currentAppId = configStore.get('currentAppId')
      if (currentAppId) {
        // 有默认值
        const findApps = await this.appStore.find({ _id: currentAppId })
        if (findApps.length <= 0) throw new Error('没有可初始化的 app')
        ;[finallyApp] = findApps
      } else {
        const findApps = await this.appStore.find({})
        if (findApps.length <= 0) throw new Error('没有可初始化的 app')
        ;[finallyApp] = findApps
      }
    }

    this.oss.changeContext(finallyApp.type, finallyApp.ak, finallyApp.sk)

    return finallyApp
  }

  async addApp(params: any) {
    const { name, ak } = params

    // 1、判断是否已经存在 name
    const appsByName = await this.appStore.find({ name })
    if (appsByName.length > 0) return [] // throw new Error('应用名称已经存在1111')
    // 2、判断是否已经存在 ak
    const appsByAk = await this.appStore.find({ ak })
    if (appsByAk.length > 0) return [] // throw new Error('该 AK 已经存在2222')

    // 通过验证保存数据
    return this.appStore.insert({ ...params })
  }

  async updateApp(params: any) {}

  async deleteApp(id: string) {
    // 查找数据库中是否存在
    const selected = await this.appStore.find({ _id: id })
    if (!selected) throw new Error('没有找到该 app')
    // 删除数据
    await this.appStore.remove({ _id: id }, {})
    // 清理上下文信息
    this.oss.clearContext()
  }

  async getApps() {
    return this.appStore.find({})
  }

  async getBuckets(params?: { type: OssType; ak: string; sk: string }) {
    if (params && Object.keys(params).length > 0) {
      // 返回当前配置的 bucket 列表
      const { type, ak, sk } = params
      const app = OssService.create(type, ak, sk)

      return app.getBucketList()
    }

    const instance = this.oss.getService()

    return instance.getBucketList()
  }

  async switchBucket(bucketName: string) {
    const instance = this.oss.getService()

    await instance.setBucket(bucketName)

    const files = await instance.getBucketFiles()

    const domains = await instance.getBucketDomainList()

    return { files, domains, type: instance.type }
  }

  async getFileUrl(remotePath: any) {
    const instance = this.oss.getService()

    return instance.generateUrl(remotePath)
  }

  async downloadFile({ files, remoteDir }: { files: any; remoteDir: string }) {
    const instance = this.oss.getService()

    const customDownloadDir = configStore.get('downloadDir')

    for (const item of files) {
      const remotePath = item.webkitRelativePath

      const localPath = path.relative(remoteDir, item.webkitRelativePath)

      const downloadPath = path.join(customDownloadDir, localPath)

      fs.mkdirSync(path.dirname(downloadPath), { recursive: true })

      const id = shortid()

      const callback = (taskId: string, process: number) => {
        this.taskRunner?.setProgress(taskId, process)
      }

      const task: Task<any> = {
        id,
        name: path.basename(localPath),
        date: Date.now(),
        type: TaskType.download,
        size: item.size,
        progress: 0,
        localPath: downloadPath,
        result: instance.downloadFile(id, remotePath, downloadPath, callback),
      }

      // await instance.downloadFile(id, remotePath, downloadPath, () => {})

      // emitter.emit('downloadFile', downloadPath)
      this.taskRunner?.addTask(task)
    }
  }

  async deleteFile({
    files,
    showEmit = false,
  }: {
    files: any
    showEmit?: boolean
  }) {
    const instance = this.oss.getService()

    for (const file of files) {
      const remotePath = file.webkitRelativePath

      await instance.deleteFile(remotePath)

      if (showEmit) {
        emitter.emit('deleteFile', remotePath)
      }
    }
  }

  async refreshBucket(force: boolean) {
    const instance = this.oss.getService()

    const files = await instance.getBucketFiles()
    const domains = await instance.getBucketDomainList()

    return { files, domains, type: instance.type }
  }

  async uploadFiles(params: any) {
    const { remoteDir, fileList } = params

    const instance = this.oss.getService()

    const baseDir = path.dirname(fileList[0])

    const filepathList = fattenFileList(fileList)

    for (const filepath of filepathList) {
      const relativePath = path.relative(baseDir, filepath)

      let remotePath = path.join(remoteDir, relativePath)

      remotePath = remotePath.replace(/\\+/g, '/')

      const id = shortid()

      const callback = (taskId: string, process: number) =>
        this.taskRunner?.setProgress(taskId, process)

      const task: Task<any> = {
        id,
        name: path.basename(remotePath),
        date: Date.now(),
        type: TaskType.upload,
        size: pathStatsSync(filepath).size,
        progress: 0,
        result: instance.uploadFile(id, remotePath, filepath, callback),
      }

      this.taskRunner?.addTask(task)
      /* instance.uploadFile(id, remotePath, filepath, () => {
        emitter.emit('uploadFileSuccess')
      }) */
    }
  }

  async getTransfers(query: any) {
    return this.transferStore.find(query)
  }

  async removeTransfers(status: TransferStatus) {
    return this.transferStore.remove({ status }, { multi: true })
  }
}

export default IpcChannelsService
