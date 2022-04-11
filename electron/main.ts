import { app, BrowserWindow, ipcMain } from 'electron'

const path = require('path')

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
      scrollBounce: true,
      nodeIntegration: true,
      contextIsolation: true,
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
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })
}

app.setAppUserModelId('软件管理')

app.name = '软件管理'

app.dock && app.dock.setIcon(Icon)

app.commandLine.appendSwitch('max-active-webgl-contexts', '32') // 设置webgl最大值

app.commandLine.appendSwitch('ignore-gpu-blacklist') // 忽略gpu黑名单

app
  .on('ready', createWindow)
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
