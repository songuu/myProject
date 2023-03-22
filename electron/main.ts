import { app, BrowserWindow, ipcMain, session } from 'electron'

import LoggerService from './services/LoggerService'

import { configStore } from './services/config'

import { registerGlobalShortcut } from './globalShortcut'

import Screenshots from './pages/screenshots'

import { makeTray } from './tray'

import InitOssIpcMain from './ipcMain/oss'
import InitSettingIpcMain from './ipcMain/setting'
import InitChatIpcMain from './ipcMain/chat'

const path = require('path')

const clc = require('cli-color')
const log = (text: string) => {
  console.log(`${clc.blueBright('[ipcMain.js]')} ${text}`)
}

const logger = new LoggerService()

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

function createTasks() {
  app.setUserTasks([
    {
      program: process.execPath,
      arguments: '--new-tab',
      iconPath: Icon,
      iconIndex: 0,
      title: '新窗口',
      description: '打开新窗口',
    },
  ])
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

  ipcMain.on('captureScreen', _ => {
    log('captureScreen')
    screenshots.startCapture()
  })

  const ossIpc = new InitOssIpcMain(mainWindow)

  const settingIpc = new InitSettingIpcMain(mainWindow, updateSystemShortcut)

  const chatIpc = new InitChatIpcMain()

  ossIpc.init()

  settingIpc.init()

  chatIpc.init()
}

// * 系统层面的功能
const updateSystemShortcut = (id: string) => {
  switch (id) {
    case 'getCapture':
      screenshots.startCapture()
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

app
  .on('ready', async () => {
    createWindow()

    createTasks()

    logger.info('初始化成功')

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
            'Access-Control-Allow-Origin': ['*'],
          },
          details.responseHeaders
        ),
      })
    })

    session.defaultSession.webRequest.onBeforeRequest(
      {
        urls: ['http://localhost:3031/api/*'],
      },
      (details, callback) => {
        callback({ redirectURL: 'http://localhost:3003/' })
      }
    )
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
        const shortcuts: any = configStore.store.settings.storage ?? []

        const newShortcut = shortcuts.concat([name])

        configStore.store.settings.storage = newShortcut
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

      if (configStore.store.settings.enableGlobalShortcut !== false) {
        registerGlobalShortcut(
          mainWindow,
          configStore.store,
          updateSystemShortcut
        )
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
