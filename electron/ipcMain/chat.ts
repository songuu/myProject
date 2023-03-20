import { ipcMain } from 'electron'

import { cloneDeep } from 'lodash'

import { v4 as uuidv4 } from 'uuid'

import { IpcResponse } from '../services/interface'

import { configStore } from '../services/config'

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

    // 清空chatgpt 历史记录
    registerIpc('clearChatSessions', async () => {
      try {
        configStore.set('chat.sessions', [])
        configStore.set('chat.activeSession', '')
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 获取chatgpt 具体历史记录
    registerIpc('getChatSessionById', async (id: string) => {
      try {
        const chatSessions: any = configStore.get('chat.sessions')
        const chatSession =
          chatSessions.find((item: any) => item.id === id)?.data || []
        return success(chatSession)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 删除chatgpt 历史记录
    registerIpc('deleteChatSessionById', async (id: string) => {
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

    // 编辑chatgpt 历史记录 [名称，编辑状态]
    registerIpc('updateChatSession', async (data: any) => {
      try {
        const chatSessions: any = configStore.get('chat.sessions')
        const newChatSessions = chatSessions.map((item: any) => {
          if (item.id === data.id) {
            return {
              ...item,
              ...data,
            }
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

    // 新增chatgpt 对话内容
    registerIpc('addChatSessionDataById', async (data: any) => {
      const activeId = configStore.get('chat.activeSession')
      try {
        if (!data.id && !activeId) {
          const id = uuidv4()

          await configStore.set('chat.sessions', [
            {
              id,
              title: data.data.text,
              data: [data.data],
              edit: false,
            },
          ])
          await configStore.set('chat.activeSession', id)
        }
        const chatSessions: any = configStore.get('chat.sessions')

        const index = chatSessions.findIndex((item: any) => item.id === data.id)

        if (index > -1) {
          chatSessions[index].data
            ? chatSessions[index].data.push(data.data)
            : (chatSessions[index].data = [data.data])
          if (chatSessions[index].title === '新对话') {
            chatSessions[index].title = data.data.text
          }
        }
        configStore.set('chat.sessions', chatSessions)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 编辑chatgpt 对话内容
    registerIpc('updateChatSessionDataById', async (data: any) => {
      try {
        const chatSessions: any = configStore.get('chat.sessions')

        const session = chatSessions.find((item: any) => item.id === data.id)

        if (session) {
          session.data[data.index] = data.data
          configStore.set('chat.sessions', chatSessions)
        }
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 删除chatgpt 对话内容
    registerIpc('deleteChatSessionDataById', async (id: any) => {
      try {
        const chatSessions: any = configStore.get('chat.sessions')

        const index = chatSessions.findIndex((item: any) => item.id === id)

        if (index > -1) {
          chatSessions[index].data = []
          configStore.set('chat.sessions', chatSessions)
        }
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    // 删除chatgpt 对话指定内容
    registerIpc('deleteChatSessionDataMsgById', async (data: any) => {
      try {
        const chatSessions: any = configStore.get('chat.sessions')

        const session = chatSessions.find((item: any) => item.id === data.id)

        if (session) {
          session.data.splice(data.index, 1)

          configStore.set('chat.sessions', chatSessions)
        }
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })
  }
}

export default InitChatIpcMain
