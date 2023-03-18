import Store from 'electron-store'
import path from 'path'
import { app } from 'electron'

import { cloneDeep } from 'lodash'
import shortcuts from '../../src/constants/shortcuts'

export const appDir = path.join(app.getPath('appData'), 'storage')
export const downloadDir = app.getPath('downloads')

console.log('appDir', appDir)

const initialConfig = {
  settings: {
    enableGlobalShortcut: true,
    shortcuts: cloneDeep(shortcuts),
    storage: [],
  },
  chat: {
    activeSession: '',
    setting: {},
    sessions: [],
  },
}

export interface ConfigStore {
  // 当前状态
  currentAppId?: string

  // 下载的路径
  downloadDir?: string

  settings: {
    enableGlobalShortcut: boolean
    shortcuts: any[]
    storage: string[]
  }

  chat: {
    activeSession: string
    setting: any
    sessions: any[]
  }
}

export const configStore = new Store<ConfigStore>({
  name: 'config',
  cwd: appDir,
  fileExtension: 'json',
  defaults: {
    ...initialConfig,
    downloadDir,
  },
})
