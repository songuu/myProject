import { contextBridge, ipcRenderer } from 'electron'

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
}

contextBridge.exposeInMainWorld('Main', api)
