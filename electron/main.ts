import { app, BrowserWindow, ipcMain, session, globalShortcut } from 'electron'

import Store from 'electron-store'

import cloneDeep from 'lodash/cloneDeep'

import shortcuts from '../src/constants/shortcuts'

import { registerGlobalShortcut } from './globalShortcut'

import Screenshots from './pages/screenshots'

import { makeTray } from './tray'

import InitOssIpcMain from './ipcMain/oss'

const path = require('path')

const clc = require('cli-color')
const log = (text: string) => {
  console.log(`${clc.blueBright('[ipcMain.js]')} ${text}`)
}

const userData = app.getPath('userData')

let mainWindow: BrowserWindow | null

let screenshots: any = null

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
    minWidth: 800,
    minHeight: 600,
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

function registerListeners() {
  log('registerListeners')
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
    const isMax = mainWindow?.isMaximized()

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
        registerGlobalShortcut(mainWindow, store, updateSystemShortcut)
      }
    }
  })

  ipcMain.on('updateShortcut', (_, { id, type, shortcut }) => {
    log('updateShortcut')
    const shortcuts: any = store.get('settings.shortcuts')
    const newShortcut = shortcuts.find((s: any) => s.id === id)
    newShortcut[type] = shortcut
    store.set('settings.shortcuts', shortcuts)
  })

  ipcMain.on('restoreDefaultShortcuts', _ => {
    log('restoreDefaultShortcuts')

    store.set('settings.shortcuts', cloneDeep(shortcuts))

    globalShortcut.unregisterAll()

    if (mainWindow) {
      registerGlobalShortcut(mainWindow, store, updateSystemShortcut)
    }
  })

  ipcMain.on('captureScreen', _ => {
    log('captureScreen')
    screenshots.startCapture()
  })

  const ossIpc = new InitOssIpcMain(mainWindow)

  ossIpc.init()
}

// * 系统层面的功能
const updateSystemShortcut = (id: string) => {
  switch (id) {
    case 'getCapture':
      screenshots.startCapture()
      // screenshots.$view.webContents.openDevTools()
      break
    default:
      break
  }
}

app.setAppUserModelId('管理')

app.name = '管理'

app.dock && app.dock.setIcon(Icon)

app.commandLine.appendSwitch('max-active-webgl-contexts', '32') // 设置webgl最大值

app.commandLine.appendSwitch('ignore-gpu-blacklist') // 忽略gpu黑名单

// * 初始化store
const store = new Store()

app
  .on('ready', async () => {
    createWindow()

    registerListeners()

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
  .then(() => {
    screenshots = new Screenshots()

    screenshots.on('cancel', () => {
      log('cancel')
    })

    screenshots.on(
      'ok',
      (e: Event, data: Buffer, bounds: any, name?: string) => {
        log('ok')
        const shortcuts: any = store.get('shortcuts.storage') ?? []

        const newShortcut = shortcuts.concat([name])

        store.set('shortcuts.storage', newShortcut)
      }
    )

    screenshots.on('save', (e: Event, data: Buffer) => {
      log('save')
      console.log(userData)
    })

    screenshots.on('upload', (e: Event, data: Buffer) => {
      log('upload')
      mainWindow?.webContents.send('upload-screenshots', data)
    })

    // screenshots.$view.webContents.openDevTools()

    if (mainWindow) {
      makeTray(mainWindow)

      if (store.get('settings.enableGlobalShortcut') !== false) {
        registerGlobalShortcut(mainWindow, store, updateSystemShortcut)
      }
    }
  })
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
