import {
  app,
  BrowserWindow,
  ipcMain,
  session,
  globalShortcut
} from 'electron'

import Store from 'electron-store'

import { registerGlobalShortcut } from './globalShortcut'

import { getCapture } from './screen'

import { makeTray } from './tray'

const path = require('path')

const clc = require('cli-color')
const log = (text: string) => {
  console.log(`${clc.blueBright('[ipcMain.js]')} ${text}`)
}

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const assetsPath =
  process.env.NODE_ENV === 'production'
    ? process.resourcesPath
    : app.getAppPath()

const Icon = path.join(assetsPath, 'assets', 'icon.png')

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: Icon,
    width: 1100,
    height: 700,
    titleBarStyle: 'hidden',
    backgroundColor: 'none',
    webPreferences: {
      webSecurity: false, // 解决接口的跨域的问题
      scrollBounce: true,
      nodeIntegration: true,
      // contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.openDevTools()
}

async function registerListeners() {
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })

  ipcMain.on('min-window', event => {
    mainWindow?.minimize()
  })

  ipcMain.on('unmax-window', event => {
    mainWindow?.unmaximize()
  })

  ipcMain.on('close-window', event => {
    if (mainWindow?.isFullScreen()) {
      mainWindow?.once('leave-full-screen', () => mainWindow?.hide())
      mainWindow?.setFullScreen(false)
    } else {
      mainWindow?.hide()
    }
  })

  ipcMain.on('toggle-max', event => {
    var isMax = mainWindow?.isMaximized()

    if (isMax) {
      mainWindow?.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('switchGlobalShortcutStatusTemporary', (_, status) => {
    log('switchGlobalShortcutStatusTemporary')
    if (status === 'disable') {
      globalShortcut.unregisterAll()
    } else {
      if (mainWindow) {
        registerGlobalShortcut(mainWindow, store)
      }
    }
  })

  ipcMain.on('updateShortcut', (_, payload) => {
    log('updateShortcut')
  })

  ipcMain.on('restoreDefaultShortcuts', _ => {
    log('restoreDefaultShortcuts')
    globalShortcut.unregisterAll()
  })

  // * 截屏
  ipcMain.on('captureScreen', _ => {
    log('captureScreen')
    if (mainWindow) {
      getCapture(mainWindow)
    }
  })
}

app.setAppUserModelId('管理')

app.name = '管理'

app.dock && app.dock.setIcon(Icon)

app.commandLine.appendSwitch('max-active-webgl-contexts', '32') // 设置webgl最大值

app.commandLine.appendSwitch('ignore-gpu-blacklist') // 忽略gpu黑名单

// * 初始化store
const store = new Store()

app
  .on('ready', () => {
    createWindow()
    if (mainWindow) {
      makeTray(mainWindow)

      if (store.get('settings.enableGlobalShortcut') !== false) {
        registerGlobalShortcut(mainWindow, store)
      }
    }

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      // eslint-disable-next-line node/no-callback-literal
      callback({
        responseHeaders: Object.assign(
          {
            ...details.responseHeaders,
            'Content-Security-Policy': [
              "default-src 'self' 'unsafe-inline' data:",
            ],
          },
          details.responseHeaders
        ),
      })
    })
  })
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 单例程序
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.setAsDefaultProtocolClient('applycations')
