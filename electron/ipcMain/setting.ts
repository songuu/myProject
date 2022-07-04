import { ipcMain, globalShortcut } from 'electron'

import { cloneDeep } from 'lodash'

import { IpcResponse } from '../services/interface'

import { configStore } from '../services/config'

import Logger from '../services/LoggerService'

import { registerGlobalShortcut } from '../globalShortcut'

import defaultShortcuts from '../../src/constants/shortcuts'

const clc = require('cli-color')

const log = (text: string) => {
  console.log(`${clc.blueBright('[setting.js]')} ${text}`)
}

export function success(data: any): IpcResponse {
  return { code: 0, msg: '成功', data }
}

export function fail(code: number, msg: string): IpcResponse {
  return { code, msg, data: {} }
}

const registerIpc = (
  eventName: string,
  handler: (data: any) => Promise<any>
) => {
  ipcMain.on(eventName, async (event, request: { id: string; data: any }) => {
    const { id, data } = request
    const response = { code: 200, data: {} }
    log(`SETTINGIPC 请求 ${eventName} => , ${JSON.stringify(data)}`)
    try {
      response.data = await handler(data)
    } catch (err: any) {
      response.code = err.code || 500
      response.data = err.message || 'Main process error.'
    }
    log(`SETTINGIPC 响应 ${eventName} =>  ${JSON.stringify(response)}`)
    event.sender.send(`${eventName}_res_${id}`, response)
  })
}

class InitSettingIpcMain {
  private logger = new Logger()

  private mainWindow: any
  private updateSystemShortcut: (id: string) => void

  constructor(mainWindow: any, updateSystemShortcut: (id: string) => void) {
    this.mainWindow = mainWindow
    this.updateSystemShortcut = updateSystemShortcut
  }

  init() {
    // 全局切换是否开启全局快捷键
    registerIpc('switchGlobalShortcutStatusTemporary', async status => {
      log('switchGlobalShortcutStatusTemporary')

      if (status === 'disable') {
        globalShortcut.unregisterAll()
      } else {
        if (this.mainWindow) {
          registerGlobalShortcut(
            this.mainWindow,
            configStore.store,
            this.updateSystemShortcut
          )
        }
      }
    })

    // 获取快捷键
    registerIpc('getShortcuts', async () => {
      log('getShortcut')

      try {
        const shortcuts: any = configStore.get('settings.shortcuts')

        return success(shortcuts.length ? shortcuts : defaultShortcuts)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 更新快捷键
    registerIpc('updateShortcut', async params => {
      log('updateShortcut')

      try {
        const { id, type, shortcut } = params

        const shortcuts = configStore.store.settings.shortcuts ?? []

        const newShortcut = shortcuts.find((s: any) => s.id === id)

        newShortcut[type] = shortcut

        configStore.set('settings.shortcuts', shortcuts)

        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 重置快捷键
    registerIpc('restoreDefaultShortcuts', async () => {
      log('restoreDefaultShortcuts')

      try {
        configStore.set('settings.shortcuts', cloneDeep(defaultShortcuts))

        globalShortcut.unregisterAll()

        if (this.mainWindow) {
          registerGlobalShortcut(
            this.mainWindow,
            configStore.store,
            this.updateSystemShortcut
          )
        }

        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })
  }
}

export default InitSettingIpcMain
