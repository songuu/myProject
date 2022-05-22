import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { Display } from './app'
import { Bounds } from './Screenshots/types'

type IpcRendererListener = (event: IpcRendererEvent, ...args: unknown[]) => void
type ScreenshotsListener = (...args: any[]) => void

export interface ScreenshotsData {
  bounds: Bounds
  display: Display
}

const map = new Map<ScreenshotsListener, Record<string, IpcRendererListener>>()

export const api = {
  ready: () => {
    console.log('contextBridge ready')

    ipcRenderer.send('SCREENSHOTS:ready')
  },
  upload: (arrayBuffer: ArrayBuffer, data: ScreenshotsData) => {
    console.log('contextBridge upload', arrayBuffer, data)

    ipcRenderer.send('SCREENSHOTS:upload', Buffer.from(arrayBuffer), data)
  },
  save: (arrayBuffer: ArrayBuffer, data: ScreenshotsData) => {
    console.log('contextBridge save', arrayBuffer, data)

    ipcRenderer.send('SCREENSHOTS:save', Buffer.from(arrayBuffer), data)
  },
  cancel: () => {
    console.log('contextBridge cancel')

    ipcRenderer.send('SCREENSHOTS:cancel')
  },
  ok: (arrayBuffer: ArrayBuffer, data: ScreenshotsData, name?: string) => {
    console.log('contextBridge ok', arrayBuffer, data, name)

    ipcRenderer.send('SCREENSHOTS:ok', Buffer.from(arrayBuffer), data, name)
  },
  on: (channel: string, fn: ScreenshotsListener) => {
    console.log('contextBridge on', channel, fn)

    const listener = (event: any, ...args: any[]) => fn(...args)

    const listeners = map.get(fn) ?? {}
    listeners[channel] = listener
    map.set(fn, listeners)

    ipcRenderer.on(`SCREENSHOTS:${channel}`, listener)
  },
  off: (channel: string, fn: ScreenshotsListener) => {
    console.log('contextBridge off', fn)

    const listeners = map.get(fn) ?? {}
    const listener = listeners[channel]
    delete listeners[channel]

    ipcRenderer.off(`SCREENSHOTS:${channel}`, listener)
  },
}

contextBridge.exposeInMainWorld('screenshots', api)
