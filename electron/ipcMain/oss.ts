import { ipcMain } from 'electron'

import IpcChannelsService from '../services/oss'

import { IpcResponse } from '../services/interface'

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
      const appStore = await this.appChannels.initApp(params)

      return success(appStore)
    })

    registerIpc('add-app', async params => {
      const data = await this.appChannels.addApp(params)

      return success(data)
    })

    registerIpc('"get-apps', async () => {
      const apps = await this.appChannels.getApps()
      return success(apps)
    })

    registerIpc('get-buckets', async params => {
      const buckets = await this.appChannels.getBuckets(params)

      return success(buckets)
    })

    registerIpc('switch-bucket', async params => {
      const { bucketName } = params

      if (typeof bucketName !== 'string' || bucketName === '')
        return fail(1, '参数错误')
      const obj = this.appChannels.switchBucket(bucketName)

      success(obj)
      try {
        return success('')
      } catch (err: any) {
        return fail(1, err.message)
      }
    })
  }
}

export default InitOssIpcMain
