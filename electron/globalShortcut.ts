import { BrowserWindow } from 'electron'

import Store from 'electron-store'

import shortcuts from '../src/constants/shortcuts'

const { globalShortcut } = require('electron')

type shortcutsType = {
  id: string
  name: string
  shortcut: string
  globalShortcut: string
  type?: 'system' | 'applycation'
}

// * 针对于渲染进程
const registerGlobalShortcut = (
  win: BrowserWindow,
  store: Store,
  callback: (id: string) => void
) => {
  let oldShortcuts: any = store.get('settings.shortcuts')

  if (oldShortcuts === undefined) {
    oldShortcuts = shortcuts
  }

  if (oldShortcuts.length) {
    oldShortcuts.forEach((shortcut: shortcutsType) => {
      globalShortcut.register(shortcut.globalShortcut, () => {
        if (shortcut.type === 'system') {
          callback && callback(shortcut.id)
          return
        }
        win.webContents.send(shortcut.id)
      })
    })
  }
}

export { registerGlobalShortcut }
