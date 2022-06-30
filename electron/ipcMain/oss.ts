import { ipcMain, Menu, clipboard } from 'electron'

import IpcChannelsService from '../services/oss'

import { IpcResponse } from '../services/interface'

import { configStore } from '../services/config'

import { emitter } from '../helper/utils'

const clc = require('cli-color')

const log = (text: string) => {
  console.log(`${clc.blueBright('[ipcMain.js]')} ${text}`)
}

export function success(data: any): IpcResponse {
  return { code: 0, msg: '成功', data }
}

export function fail(code: number, msg: string): IpcResponse {
  return { code, msg, data: {} }
}

const registerIpc = (
  eventName: string,
  handler: (data: any) => Promise<any>
) => {
  ipcMain.on(eventName, async (event, request: { id: string; data: any }) => {
    const { id, data } = request
    const response = { code: 200, data: {} }
    log(`IPC 请求 ${eventName} => , ${JSON.stringify(data)}`)
    try {
      response.data = await handler(data)
    } catch (err: any) {
      response.code = err.code || 500
      response.data = err.message || 'Main process error.'
    }
    log(`IPC 响应 ${eventName} =>  ${JSON.stringify(response)}`)
    event.sender.send(`${eventName}_res_${id}`, response)
  })
}

class InitOssIpcMain {
  private appChannels = new IpcChannelsService()

  private mainWindow: any

  constructor(mainWindow: any) {
    this.mainWindow = mainWindow
  }

  init() {
    registerIpc('init-app', async params => {
      try {
        const appStore = await this.appChannels.initApp(params)

        return success(appStore)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    registerIpc('add-app', async params => {
      try {
        const data = await this.appChannels.addApp(params)

        return success(data)
      } catch (err: any) {
        return fail(1, '添加失败')
      }
    })

    registerIpc('get-apps', async () => {
      try {
        const apps = await this.appChannels.getApps()
        return success(apps)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    registerIpc('get-buckets', async params => {
      try {
        const buckets = await this.appChannels.getBuckets(params)
        return success(buckets)
      } catch (err: any) {
        return fail(1, '获取 buckets 失败，请检查 ak，sk 是否匹配！')
      }
    })

    registerIpc('switch-bucket', async params => {
      const { bucketName } = params

      if (typeof bucketName !== 'string' || bucketName === '')
        return fail(1, '参数错误')

      try {
        const obj = await this.appChannels.switchBucket(bucketName)

        return success(obj)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 修改oss的配置
    registerIpc('change-setting', async params => {
      const { key, value } = params
      if (typeof key !== 'string' || key === '') return fail(1, '参数不能为空')

      switch (key) {
        case 'currentAppId':
          configStore.set(key, value)
          return success(true)
        default:
          return fail(1, '不支持该设置')
      }
    })

    // 获取文件的链接
    registerIpc('get-url', async key => {
      if (!key) return fail(1, '参数错误')

      try {
        const url = await this.appChannels.getFileUrl(key)
        return success(url)
      } catch (e: any) {
        return fail(1, e.message)
      }
    })

    registerIpc('right-temp', async ({ files, remoteDir }) => {
      const templates = [
        {
          label: '复制链接',
          click: async () => {
            const url = await this.appChannels.getFileUrl(
              files.webkitRelativePath
            )
            clipboard.writeText(url)
          },
        },
        {
          label: '下载',
          click: async () => {
            await this.appChannels.downloadFile({ files: [files], remoteDir })
          },
        },
        {
          label: '删除',
          click: async () => {
            await this.appChannels.deleteFile({ files: [files], showEmit: true })
          },
        },
      ]

      Menu.buildFromTemplate(templates).popup()

      return success(true)
    })

    registerIpc('refresh-bucket', async ({ force }: { force?: boolean }) => {
      try {
        const object = await this.appChannels.refreshBucket(!!force)
        return success(object)
      } catch (e: any) {
        return fail(1, e.message)
      }
    })

    registerIpc('upload-files', async params => {
      if (!('remoteDir' in params)) return fail(1, '参数错误')
      if (!('fileList' in params)) return fail(1, '参数错误')
      const { fileList } = params

      if (Array.isArray(fileList) && fileList.length === 0) {
        return fail(1, '参数错误')
      }
      try {
        await this.appChannels.uploadFiles(params)
        return success(true)
      } catch (e: any) {
        return fail(1, e.message)
      }
    })

    registerIpc('download-files', async params => {
      if (!('remoteDir' in params)) return fail(1, '参数错误')
      if (!('fileList' in params)) return fail(1, '参数错误')
      const { fileList, remoteDir } = params
      if (Array.isArray(fileList) && fileList.length === 0) {
        return fail(1, '参数错误')
      }

      try {
        await this.appChannels.downloadFile({
          files: [...fileList],
          remoteDir,
        })
        return success(true)
      } catch (e: any) {
        return fail(1, e.message)
      }
    })

    registerIpc('delete-files', async params => {
      if (!('fileList' in params)) return fail(1, '参数错误')

      const { fileList } = params

      if (Array.isArray(fileList) && fileList.length === 0) {
        return fail(1, '参数错误')
      }

      try {
        await this.appChannels.deleteFile({ files: [...fileList] })

        return success(true)
      } catch (e: any) {
        return fail(1, e.message)
      }
    })

    registerIpc('get-transfer', async params => {
      try {
        const transfers = await this.appChannels.getTransfers(params)
        return success(transfers)
      } catch (e: any) {
        return fail(1, e.message)
      }
    })

    registerIpc('clear-transfer-done-list', async params => {
      try {
        await this.appChannels.removeTransfers(params)
        return success(true)
      } catch (e: any) {
        return fail(1, e.message)
      }
    })

    emitter.on('deleteFile', (remotePath: string) => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send('deleteFile', remotePath)
      }
    })

    emitter.on('uploadFileSuccess', () => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send('uploadFileSuccess')
      }
    })

    emitter.on('downloadFile', (downloadPath: string) => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send('downloadFile', downloadPath)
      }
    })

    emitter.on('transfer-done', (id: string) => {
      console.log('传输文件完成')
    })

    emitter.on('transfer-process', progressList => {
      console.log('传输文件进度', progressList)
      if (this.mainWindow) {
        this.mainWindow.webContents.send('transfer-progress', progressList)
      }
    })

    // 处理传输文件失败
    emitter.on('transfer-failed', (id: string) => {
      console.error('传输文件失败')
    })

    // 处理传输完成
    emitter.on('transfer-finish', () => {
      if (this.mainWindow /* && configStore.get('transferDoneTip') */) {
        this.mainWindow.webContents.send('transfer-finish')
      }
    })
  }
}

export default InitOssIpcMain
