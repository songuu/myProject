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
  TransferStore,
  TransferStatus,
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
    ipcRenderer.removeListener(channel, (_, data) => callback(data))
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

  getEnableGlobalShortcut() {
    return asyncSend('getEnableGlobalShortcut')
  },

  // 开始设置快捷键状态
  switchGlobalShortcutStatusTemporary: (status: boolean) => {
    return asyncSend('switchGlobalShortcutStatusTemporary', status)
  },

  // 获取快捷键
  getShortcuts: () => {
    return asyncSend('getShortcuts')
  },

  // 切换设置快捷键
  updateShortcut: (payload: any) => {
    return asyncSend('updateShortcut', payload)
  },

  // 重置快捷键
  restoreDefaultShortcuts: () => {
    return asyncSend('restoreDefaultShortcuts')
  },

  // 截屏功能
  captureScreen: () => {
    ipcRenderer.send('captureScreen')
  },

  // 初始化oss
  initOss(id?: string): Promise<AppStore> {
    return asyncSend('init-app', { id })
  },

  // 获取传输列表
  getTransfers(query: any): Promise<TransferStore[]> {
    return asyncSend('get-transfer', query)
  },

  // 添加应用[绑定应用]
  addApp(params: {
    name: string
    type: OssType
    ak: string
    sk: string
  }): Promise<AppStore> {
    return asyncSend('add-app', params)
  },

  // 获取应用
  getApps(): Promise<AppStore> {
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

  // 删除应用
  deleteApp(id: string): Promise<void> {
    return asyncSend('delete-app', id)
  },

  // 弹窗提示
  showConfirm(options?: { title?: string; message?: string }) {
    return asyncSend('show-confirm', options)
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

  // 上传
  uploadFiles: (options: {
    remoteDir: string
    fileList: string[]
  }): Promise<void> => {
    return asyncSend('upload-files', options)
  },

  // 直接下载文件
  downloadFiles: (options: {
    remoteDir: string
    fileList: any[]
  }): Promise<void> => {
    return asyncSend('download-files', options)
  },

  // 删除文件
  deleteFiles: (options: { fileList: any[] }): Promise<void> => {
    return asyncSend('delete-files', options)
  },

  // 清空操作列表
  clearTransferDoneList: () => {
    return asyncSend('clear-transfer-done-list', TransferStatus.done)
  },

  // 获取chat设置
  getChatSetting: () => {
    return asyncSend('getChatSetting')
  },

  // 设置chat设置
  setChatSetting: (payload: any) => {
    return asyncSend('setChatSetting', payload)
  },

  // 重置chat设置
  resetChatSetting: () => {
    return asyncSend('resetChatSetting')
  },

  // 获取chat列表
  getChatSessions: () => {
    return asyncSend('getChatSessions')
  },

  getChatSessionById: (payload: any) => {
    return asyncSend('getChatSessionById', payload)
  },

  // 删除chat 对话
  deleteChatSessionById: (payload: any) => {
    return asyncSend('deleteChatSessionById', payload)
  },

  // 新增chat 对话
  addChatSession: (payload: any) => {
    return asyncSend('addChatSession', payload)
  },

  // 清空chat 对话列表
  clearChatSessions: () => {
    return asyncSend('clearChatSessions')
  },

  // 编辑chat 对话
  updateChatSession: (payload: any) => {
    return asyncSend('updateChatSession', payload)
  },

  // 设置选中的chat 对话
  setActiveChatSession: (payload: any) => {
    return asyncSend('setActiveChatSession', payload)
  },

  // 获取选中的chat 对话
  getActiveChatSession: () => {
    return asyncSend('getActiveChatSession')
  },

  // 新增chat 消息
  addChatSessionDataById: (payload: any) => {
    return asyncSend('addChatSessionDataById', payload)
  },

  // 编辑chat 消息
  updateChatSessionDataById: (payload: any) => {
    return asyncSend('updateChatSessionDataById', payload)
  },

  // 删除chat 指定消息
  deleteChatSessionDataMsgById: (payload: any) => {
    return asyncSend('deleteChatSessionDataMsgById', payload)
  },

  // 删除chat 消息
  deleteChatSessionDataById: (payload: any) => {
    return asyncSend('deleteChatSessionDataById', payload)
  },

  // 获取chat 指定消息
  getChatSessionDataMsgByIdAndIndex: (payload: any) => {
    return asyncSend('getChatSessionDataMsgByIdAndIndex', payload)
  },
}

contextBridge.exposeInMainWorld('Main', api)
