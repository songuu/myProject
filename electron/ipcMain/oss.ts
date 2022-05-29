import { ipcMain } from 'electron'

import IpcChannelsService from '../services/oss'

import { IpcResponse } from '../services/interface'

import { configStore } from '../services/config'

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

      console.log("bucketName", bucketName)
      try {
        const obj = this.appChannels.switchBucket(bucketName)

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
  }
}

export default InitOssIpcMain
