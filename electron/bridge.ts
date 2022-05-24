import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

import { OssType, IpcResponse, AppStore } from './services/interface'

const asyncSend = (eventName: string, options = {}): any => {
  const data = options
  const id = new Date().getTime()
  const responseEvent = `${eventName}_res_${id}`
  return new Promise<IpcResponse>((resolve, reject) => {
    ipcRenderer.once(
      responseEvent,
      (event: IpcRendererEvent, response: { code: number; data: any }) => {
        if (response.code === 200) {
          const { code, msg, data: resData } = response.data
          if (code !== 0) {
            reject(new Error(msg))
          }
          resolve(resData)
        } else {
          reject(response.data)
        }
      }
    )
    ipcRenderer.send(eventName, { id, data })
  })
}

export const api = {
  sendMessage: (message: string) => {
    ipcRenderer.send('message', message)
  },

  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },

  // 关闭窗口
  closeWindow() {
    ipcRenderer.send('close-window')
  },

  // 最小化窗口
  minWindow() {
    ipcRenderer.send('min-window')
  },

  // 切换窗口状态：如果当前状态是最大化则取消最大化，否则最大化
  toggleWindow() {
    ipcRenderer.send('toggle-max')
  },

  // 开始设置快捷键状态
  switchGlobalShortcutStatusTemporary: (status: 'enable' | 'disable') => {
    ipcRenderer.send('switchGlobalShortcutStatusTemporary', status)
  },

  // 切换设置快捷键
  updateShortcut: (payload: any) => {
    ipcRenderer.send('updateShortcut', payload)
  },

  // 重置快捷键
  restoreDefaultShortcuts: () => {
    ipcRenderer.send('restoreDefaultShortcuts')
  },

  // 截屏功能
  captureScreen: () => {
    ipcRenderer.send('captureScreen')
  },

  // 获取bucket列表
  getBuckets(config?: {
    type: OssType
    ak: string
    sk: string
  }): Promise<string[]> {
    return asyncSend('get-buckets', config)
  },

  // 添加应用[绑定应用]
  addApp(
    name: string,
    type: OssType,
    ak: string,
    sk: string
  ): Promise<AppStore> {
    const app = { name, type, ak, sk }
    return asyncSend('add-app', app)
  },

  // 初始化oss应用
  initOss(id?: string): Promise<AppStore> {
    return asyncSend('init-app', { id })
  },
}

contextBridge.exposeInMainWorld('Main', api)
