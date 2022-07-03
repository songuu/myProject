import Store from 'electron-store'
import path from 'path'
import { app } from 'electron'

export const appDir = path.join(app.getPath('appData'), 'storage')
export const downloadDir = app.getPath('downloads')

const initialConfig = {
  settings: {
    enableGlobalShortcut: true,
    shortcuts: [],
  },
}

export interface ConfigStore {
  // 当前状态
  currentAppId?: string

  // 下载的路径
  downloadDir?: string

  settings: {
    enableGlobalShortcut: boolean
    shortcuts: any
  }
}

export const configStore = new Store<ConfigStore>({
  name: 'config',
  cwd: appDir,
  fileExtension: 'json',
  defaults: { ...initialConfig, downloadDir },
})
