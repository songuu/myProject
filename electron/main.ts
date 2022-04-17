import { app, BrowserWindow, ipcMain } from 'electron'

const path = require('path')

import { makeTray } from './tray'

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

  ipcMain.on("min-window", (event) => {
    mainWindow?.minimize();
  })

  ipcMain.on("unmax-window", (event) => {
    mainWindow?.unmaximize();
  })

  ipcMain.on("close-window", (event) => {
    if (mainWindow?.isFullScreen()) {
      mainWindow?.once("leave-full-screen", () => mainWindow?.hide());
      mainWindow?.setFullScreen(false);
    } else {
      mainWindow?.hide();
    }
  });

  ipcMain.on("toggle-max", (event) => {
    var isMax = mainWindow?.isMaximized();

    if (isMax) {
      mainWindow?.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
}

app.setAppUserModelId('表情管理')

app.name = '表情管理'

app.dock && app.dock.setIcon(Icon)

app.dock && app.dock.setIcon(Icon)

app.commandLine.appendSwitch('max-active-webgl-contexts', '32') // 设置webgl最大值

app.commandLine.appendSwitch('ignore-gpu-blacklist') // 忽略gpu黑名单

app
  .on('ready', () => {
    createWindow()
    if (mainWindow) { makeTray(mainWindow) };
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