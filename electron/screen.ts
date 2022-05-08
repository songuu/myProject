import { BrowserWindow, screen, desktopCapturer, dialog } from 'electron'

const fs = require('fs')

const clc = require('cli-color')
const log = (text: string) => {
  console.log(`${clc.blueBright('[globalShortcut.js]')} ${text}`)
}

// 未做任何处理的情况下，默认的系统截屏
const getCapture = async (win: BrowserWindow) => {
  log('getCapture')

  const { width, height } = screen.getPrimaryDisplay().size

  // 捕获屏幕
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width, height },
  })

  const path = await dialog.showSaveDialog(win, {
    title: '保存截图',
    defaultPath: `截图_${new Date().getTime()}`,
    filters: [{ name: 'Images', extensions: ['png'] }],
  })

  if (path.filePath) {
    fs.writeFile(
      path.filePath,
      sources[0].thumbnail.toPNG(),
      (error: Error) => {
        if (error) {
          console.log(error)
        }
      }
    )
  }
}

export { getCapture }
