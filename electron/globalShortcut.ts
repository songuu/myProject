import { BrowserWindow } from 'electron'

import Store from 'electron-store'

import shortcuts from '../src/constants/shortcuts'

const { globalShortcut } = require('electron')

const clc = require('cli-color')
const log = (text: string) => {
  console.log(`${clc.blueBright('[globalShortcut.js]')} ${text}`)
}

type shortcutsType = {
  id: string
  name: string
  shortcut: string
  globalShortcut: string
}

const registerGlobalShortcut = (win: BrowserWindow, store: Store) => {
  log('registerGlobalShortcut')
  let oldShortcuts: any = store.get('settings.shortcuts')

  if (oldShortcuts === undefined) {
    oldShortcuts = shortcuts
  }

  if (oldShortcuts.length) {
    oldShortcuts.forEach((shortcut: shortcutsType) => {
      globalShortcut.register(shortcut.globalShortcut, () => {
        win.webContents.send(shortcut.id)
      })
    })
  }
}

export { registerGlobalShortcut }
