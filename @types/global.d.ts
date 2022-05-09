import { Display } from '../react-screenshots/app'
import { Bounds } from '../react-screenshots/Screenshots/types'

type ScreenshotsListener = (...args: never[]) => void

interface ScreenshotsData {
  bounds: Bounds
  display: Display
}

interface GlobalScreenshots {
  ready: () => void
  save: (arrayBuffer: ArrayBuffer, data: ScreenshotsData) => void
  cancel: () => void
  ok: (arrayBuffer: ArrayBuffer, data: ScreenshotsData) => void
  on: (channel: string, fn: ScreenshotsListener) => void
  off: (channel: string, fn: ScreenshotsListener) => void
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    screenshots: GlobalScreenshots
  }
}
