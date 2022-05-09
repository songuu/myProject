import {
  dialog,
  ipcMain,
  clipboard,
  nativeImage,
  BrowserWindow,
  BrowserView,
  desktopCapturer,
} from 'electron'

import fs from 'fs/promises'
import Event from './event'

import Events from 'events'

import { Bounds, Lang } from 'react-screenshots'

import getBoundAndDisplay, { BoundAndDisplay } from './getBoundAndDisplay'

const path = require('path')

const clc = require('cli-color')

const log = (text: string) => {
  console.log(`${clc.blueBright('[screenshots]')} ${text}`)
}

export interface ScreenshotsOpts {
  lang: Partial<Lang>
}

declare const SCREENSHOTS_WEBPACK_ENTRY: string

/*
 * 需要首先定义一个窗口
 * 主进程发布事件，窗口订阅执行
 *
 */
class Screenshots extends Events {
  public $win: BrowserWindow | null = null

  public $view: BrowserView = new BrowserView({
    webPreferences: {
      preload: require.resolve('./preload.ts'),
      nodeIntegration: false,
      contextIsolation: true,
      nativeWindowOpen: false,
    },
  })

  constructor(opts?: any) {
    super()

    this.listenIpc()

    this.$view.webContents.loadURL(SCREENSHOTS_WEBPACK_ENTRY)
  }

  /*
   * 接受指令 初始化
   *
   */
  private isReady = new Promise<void>(resolve => {
    ipcMain.once('SCREENSHOTS:ready', () => {
      log('SCREENSHOTS:ready')

      resolve()
    })
  })

  /*
   * 绑定ipc事件处理
   *    1. 截屏完成
   *    2. 截屏取消
   *    3. 截屏保存 下载
   */
  private listenIpc(): void {
    log('listenIpc')

    ipcMain.on('SCREENSHOTS:capture:done', (event, data) => {})

    ipcMain.on('SCREENSHOTS:capture:cancel', (event, data) => {})

    ipcMain.on('SCREENSHOTS:capture:save', (event, data) => {})
  }

  /*
   * 开始截屏
   *
   */
  public startCapture(): void {
    log('startCapture')

    this.isReady.then(() => {
      log('isReady')

      // 需要基于之前的窗口已经销毁
      if (this.$win && !this.$win.isDestroyed()) {
        this.$win.close()
      }

      const boundAndDisplay = getBoundAndDisplay()

      this.createWindow(boundAndDisplay)

      // 捕捉桌面之后显示窗口
      // 避免截图窗口自己被截图
      this.capture(boundAndDisplay).then(() => {
        if (!this.$win) return
        // linux截图存在黑屏，这里设置为false就不会出现这个问题
        this.$win.setFullScreen(true)
        this.$win.show()
        this.$win.focus()
      })
    })
  }

  /*
   * 结束截屏
   *
   */
  public endCapture(): void {
    log('endCapture')

    if (!this.$win) return

    this.$win.setSimpleFullScreen(false)
    this.$win.close()
    this.$win = null
  }

  /**
   * 初始化窗口
   */
  private createWindow({ bound }: BoundAndDisplay): void {
    log('createWindow')
  }

  private async capture({ display }: BoundAndDisplay): Promise<void> {
    log('capture')
  }
}
export default Screenshots
