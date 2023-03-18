import { ipcMain, globalShortcut } from 'electron'

import { cloneDeep } from 'lodash'

import { IpcResponse } from '../services/interface'

import { configStore } from '../services/config'

import Logger from '../services/LoggerService'

const clc = require('cli-color')

const log = (text: string) => {
  console.log(`${clc.blueBright('[chat.ts]')} ${text}`)
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
    log(`CHATIPC 请求 ${eventName} => , ${JSON.stringify(data)}`)
    try {
      response.data = await handler(data)
    } catch (err: any) {
      response.code = err.code || 500
      response.data = err.message || 'Main process error.'
    }
    log(`CHATIPC 响应 ${eventName} =>  ${JSON.stringify(response)}`)
    event.sender.send(`${eventName}_res_${id}`, response)
  })
}

class InitChatIpcMain {
  private logger = new Logger()

  private mainWindow: any

  constructor(mainWindow: any) {
    this.mainWindow = mainWindow
  }

  init() {
    // 获取chatgpt 设置
    registerIpc('getChatSetting', async () => {
      try {
        const chatSetting = configStore.get('chat.setting')
        return success(chatSetting)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 设置chatgpt 设置
    registerIpc('setChatSetting', async (data: any) => {
      try {
        configStore.set('chat.setting', data)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 重置chatgpt 设置
    registerIpc('resetChatSetting', async () => {
      try {
        configStore.set('chat.setting', {})
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 获取chatgpt 历史记录
    registerIpc('getChatSessions', async () => {
      try {
        const chatSessions = configStore.get('chat.sessions')
        return success(chatSessions)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 删除chatgpt 历史记录
    registerIpc('deleteChatSession', async (id: any) => {
      try {
        const chatSessions: any = configStore.get('chat.sessions')
        const activeSession = configStore.get('chat.activeSession')

        const newChatSessions = chatSessions.filter(
          (item: any) => item.id !== id
        )

        if (activeSession === id && newChatSessions.length > 0) {
          await configStore.set('chat.activeSession', newChatSessions[0].id)
        }

        await configStore.set('chat.sessions', newChatSessions)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 新增chatgpt 对话
    registerIpc('addChatSession', async (data: any) => {
      try {
        const chatSessions: any = configStore.get('chat.sessions') || []
        const newChatSessions = cloneDeep(chatSessions)
        newChatSessions.unshift(data)
        configStore.set('chat.sessions', newChatSessions)
        configStore.set('chat.activeSession', data.id)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 清空chatgpt 历史记录
    registerIpc('clearChatSessions', async () => {
      try {
        configStore.set('chat.sessions', [])
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 编辑chatgpt 历史记录 [名称，对话内容，编辑状态]
    registerIpc('editChatSession', async (data: any) => {
      try {
        const chatSessions: any = configStore.get('chat.sessions')
        const newChatSessions = chatSessions.map((item: any) => {
          if (item.id === data.id) {
            return data
          }
          return item
        })
        configStore.set('chat.sessions', newChatSessions)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 设置选中的chatgpt 历史对话
    registerIpc('setActiveChatSession', async (data: any) => {
      try {
        configStore.set('chat.activeSession', data)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 获取选中的chatgpt 历史对话
    registerIpc('getActiveChatSession', async () => {
      try {
        const activeSession = configStore.get('chat.activeSession')
        return success(activeSession)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })
  }
}

export default InitChatIpcMain
