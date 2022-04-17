import {
    app,
    BrowserWindow,
    Menu,
    MenuItemConstructorOptions,
    screen,
    Tray,
} from 'electron'

const path = require('path')

let tray: Tray | null = null

const assetsPath =
  process.env.NODE_ENV === 'production'
    ? process.resourcesPath
    : app.getAppPath()

const Icon = path.join(assetsPath, 'assets', 'icon.png')
// 创建tray
const makeTray  = (win: BrowserWindow) => {
    if(tray) tray = null
    tray = new Tray(Icon)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '打开',
            click: () => {
                win.isVisible() ? win.focus() : win.show()
            }
        },
        {
            label: '退出',
            click: () => {
                app.quit()
            }
        }
    ])
    tray.setToolTip('表情管理')
    tray.setContextMenu(contextMenu)
}

export {tray, makeTray}