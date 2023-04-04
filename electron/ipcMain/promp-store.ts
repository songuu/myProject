import { ipcMain } from 'electron'

import { v4 as uuidv4 } from 'uuid'

import { IpcResponse } from '../services/interface'

import { configStore } from '../services/config'

const clc = require('cli-color')

const log = (text: string) => {
  console.log(`${clc.blueBright('[promp-store.ts]')} ${text}`)
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
    log(`PROMPSTORE 请求 ${eventName} => , ${JSON.stringify(data)}`)
    try {
      response.data = await handler(data)
    } catch (err: any) {
      response.code = err.code || 500
      response.data = err.message || 'Main process error.'
    }
    log(`PROMPSTORE 响应 ${eventName} =>  ${JSON.stringify(response)}`)
    event.sender.send(`${eventName}_res_${id}`, response)
  })
}

class InitPrompStoreIpcMain {
  init() {
    registerIpc('getPromptList', async () => {
      try {
        const promptList = configStore.get('prompt.list')
        return success(promptList)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    registerIpc('addPrompt', async (data: Prompt.Prompt) => {
      try {
        const promptList: any = configStore.get('prompt.list')
        promptList.push(data)
        configStore.set('prompt.list', promptList)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    registerIpc('updatePrompt', async (data: {
      data: Prompt.Prompt,
      type: 'index' | 'key',
      value: string
    }) => {
      try {
        const promptList: any = configStore.get('prompt.list')

        switch (data.type) {
          case 'index':
            promptList[data.value] = data.data;
            break;
          case 'key':
            const index = promptList.findIndex((item: Prompt.Prompt) => item.key === data.value)
            promptList[index] = data.data;
        }
        configStore.set('prompt.list', promptList)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    registerIpc('setPromptList', async (data: any) => {
      try {
        configStore.set('prompt.list', data)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })

    registerIpc('deletePrompt', async (data: any) => {
      try {
        const promptList: Prompt.Prompt[] = configStore.get('prompt.list')
        const newPromptList = promptList.splice(data, 1)
        configStore.set('prompt.list', newPromptList)
        return success(true)
      } catch (err: any) {
        return fail(1, err.message)
      }
    })
  }
}

export default InitPrompStoreIpcMain;