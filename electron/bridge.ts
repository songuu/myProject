import { contextBridge, ipcRenderer } from 'electron'

export const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sendMessage`
   */

  sendMessage: (message: string) => {
    ipcRenderer.send('message', message)
  },

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },

  // 关闭窗口
  closeWindow() {
    ipcRenderer.send("close-window");
  },

  // 最小化窗口
  minWindow() {
    ipcRenderer.send("min-window");
  },

  // 切换窗口状态：如果当前状态是最大化则取消最大化，否则最大化
  toggleWindow() {
    ipcRenderer.send("toggle-max");
  }
}

contextBridge.exposeInMainWorld('Main', api)
