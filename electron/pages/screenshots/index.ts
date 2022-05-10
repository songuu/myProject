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

import { Bounds } from 'react-screenshots'

import getBoundAndDisplay, { BoundAndDisplay } from './getBoundAndDisplay'

import padStart from './padStart'

const clc = require('cli-color')

const log = (text: string) => {
  console.log(`${clc.blueBright('[screenshots]')} ${text}`)
}

declare const SCREENSHOTS_WEBPACK_ENTRY: string
declare const SCREENSHOTS_PRELOAD_WEBPACK_ENTRY: string

/*
 * 需要首先定义一个窗口
 * 主进程发布事件，窗口订阅执行
 *
 */
class Screenshots extends Events {
  public $win: BrowserWindow | null = null

  public $view: BrowserView = new BrowserView({
    webPreferences: {
      preload: SCREENSHOTS_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      nativeWindowOpen: false,
    },
  })

  constructor() {
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

    ipcMain.on(
      'SCREENSHOTS:capture:ok',
      (e, buffer: Buffer, bounds: Bounds) => {
        log('SCREENSHOTS:capture:ok')

        const event = new Event()

        this.emit('ok', event, buffer, bounds)

        if (event.defaultPrevented) {
          return
        }

        clipboard.writeImage(nativeImage.createFromBuffer(buffer))

        this.endCapture()
      }
    )

    ipcMain.on('SCREENSHOTS:capture:cancel', () => {
      log('SCREENSHOTS:capture:cancel')
      const event = new Event()
      this.emit('cancel', event)
      if (event.defaultPrevented) {
        return
      }
      this.endCapture()
    })

    ipcMain.on(
      'SCREENSHOTS:capture:save',
      async (e, buffer: Buffer, bounds: Bounds) => {
        log('SCREENSHOTS:capture:save')

        const event = new Event()
        this.emit('save', event, buffer, bounds)
        if (event.defaultPrevented || !this.$win) {
          return
        }

        const time = new Date()
        const year = time.getFullYear()
        const month = padStart(time.getMonth() + 1, 2, '0')
        const date = padStart(time.getDate(), 2, '0')
        const hours = padStart(time.getHours(), 2, '0')
        const minutes = padStart(time.getMinutes(), 2, '0')
        const seconds = padStart(time.getSeconds(), 2, '0')
        const milliseconds = padStart(time.getMilliseconds(), 3, '0')

        this.$win.setAlwaysOnTop(false)

        const { canceled, filePath } = await dialog.showSaveDialog(this.$win, {
          title: '保存图片',
          defaultPath: `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}.png`,
        })

        if (!this.$win) {
          return
        }

        this.$win.setAlwaysOnTop(true)
        if (canceled || !filePath) {
          return
        }

        await fs.writeFile(filePath, buffer)
        this.endCapture()
      }
    )
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
    this.$win = new BrowserWindow({
      title: 'screenshots',
      x: bound.x,
      y: bound.y,
      width: bound.width,
      height: bound.height,
      useContentSize: true,
      frame: false,
      show: false,
      autoHideMenuBar: true,
      transparent: true,
      resizable: false,
      movable: false,
      focusable: true,
      // 为true，截屏显示为黑屏
      // 所以在截屏图像生成后再设置为true
      // 参考48-49行
      fullscreen: false,
      // 设为true mac全屏窗口没有桌面滚动效果
      simpleFullscreen: true,
      backgroundColor: '#00000000',
      titleBarStyle: 'hidden',
      alwaysOnTop: true,
      enableLargerThanScreen: true,
      skipTaskbar: true,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        nativeWindowOpen: false,
      },
    })

    this.$win.setBrowserView(this.$view)
    this.$view.setBounds(bound)
  }

  private async capture({ display }: BoundAndDisplay): Promise<void> {
    log('capture')

    try {
      const { Screenshots: NodeScreenshots } = await import('node-screenshots')
      const capturer = NodeScreenshots.fromDisplay(display.id)

      if (!capturer) {
        throw new Error(`NodeScreenshots.fromDisplay(${display.id}) get null`)
      }

      const image = await capturer.capture()
      this.$view.webContents.send(
        'SCREENSHOTS:capture',
        display,
        `data:image/png;base64,${image.toString('base64')}`
      )
    } catch (e) {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: display.width,
          height: display.height,
        },
      })

      let source
      // Linux系统上，screen.getDisplayNearestPoint 返回的 Display 对象的 id 和 这儿 source 对象上的 display_id(Linux上，这个值是空字符串) 或 id 的中间部分，都不一致
      // 但是，如果只有一个显示器的话，其实不用判断，直接返回就行
      if (sources.length === 1) {
        source = sources[0]
      } else {
        source = sources.find(source => {
          return (
            source.display_id === display.id.toString() ||
            source.id.startsWith(`screen:${display.id}:`)
          )
        })
      }

      if (!source) {
        console.error(sources)
        console.error(display)
        console.error("Can't find screen source")
        return
      }

      this.$view.webContents.send(
        'SCREENSHOTS:capture',
        display,
        source.thumbnail.toDataURL()
      )
    }
  }
}
export default Screenshots
