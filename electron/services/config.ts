import Store from 'electron-store'
import path from 'path'
import { app } from 'electron'

import { cloneDeep } from 'lodash'
import shortcuts from '../../src/constants/shortcuts'

import { languages } from '../typing'

export const appDir = path.join(app.getPath('appData'), 'storage')
export const downloadDir = app.getPath('downloads')

const initialConfig = {
  settings: {
    enableGlobalShortcut: true,
    shortcuts: cloneDeep(shortcuts),
    storage: [],
  },
  chat: {
    activeSession: '',
    setting: {
      apiKey: '',
      apiURL: ''
    },
    sessions: [],
  },
  prompt: {
    list: []
  },
  theme: 'auto',
  language: languages['zh-CN'],
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
    setting?: Chat.Setting
    sessions: any[]
  }

  prompt: {
    list: any[]
  }

  theme: string

  language: languages
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
