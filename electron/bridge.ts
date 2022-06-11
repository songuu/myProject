import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  Menu,
  Clipboard,
} from 'electron'

import {
  OssType,
  IpcResponse,
  AppStore,
  BucketMeta,
} from './services/interface'

const asyncSend = (eventName: string, options = {}): any => {
  const data = options
  const id = new Date().getTime()
  const responseEvent = `${eventName}_res_${id}`
  return new Promise<IpcResponse>((resolve, reject) => {
    ipcRenderer.once(
      responseEvent,
      (event: IpcRendererEvent, response: { code: number; data: any }) => {
        if (response.code === 200) {
          const { code = '', msg, data: resData } = response.data ?? {}
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

  off: (channel: string, callback: Function) => {
    ipcRenderer.removeListener(channel, callback)
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

  // 初始化oss
  initOss(id?: string): Promise<AppStore> {
    return asyncSend('init-app', { id })
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

  // 获取应用
  getApp(): Promise<AppStore> {
    return asyncSend('get-apps')
  },

  // 获取bucket列表
  getBuckets(config?: {
    type: OssType
    ak: string
    sk: string
  }): Promise<string[]> {
    return asyncSend('get-buckets', config)
  },

  // 切换bucket
  switchBucket(bucketName: string): Promise<BucketMeta> {
    return asyncSend('switch-bucket', { bucketName })
  },

  // 修改设置
  changeSetting(key: string, value?: string): Promise<void> {
    return asyncSend('change-setting', { key, value })
  },

  // 右键
  showContextMenu: ({
    files,
    remoteDir,
  }: {
    files: any
    remoteDir: string
  }) => {
    return asyncSend('right-temp', {
      files,
      remoteDir,
    })
  },

  // 刷新
  refreshBucket: (force?: boolean): Promise<BucketMeta> => {
    return asyncSend('refresh-bucket', { force })
  },
}

contextBridge.exposeInMainWorld('Main', api)
