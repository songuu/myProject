import { api as Main } from '../electron/bridge'
import { api as Screenshots } from '../react-screenshots/bridge'

declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof Main
    screenshots: typeof Screenshots
  }
}
