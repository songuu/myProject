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
      } catch (e) {
        return fail(1, '错误')
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
            await this.appChannels.downloadFile(files, remoteDir)
          },
        },
        {
          label: '删除',
          click: async () => {
            await this.appChannels.deleteFile(files)
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
      } catch (e) {
        return fail(1, 'err')
      }
    })

    emitter.on('deleteFile', (remotePath: string) => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send('deleteFile', remotePath)
      }
    })
  }
}

export default InitOssIpcMain
