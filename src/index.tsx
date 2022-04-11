import { createRoot } from 'react-dom/client'
import App from './App'
import '@styles/index.less'

const rootElement = document.getElementById('root')

const root = createRoot(rootElement)
root.render(<App />)
