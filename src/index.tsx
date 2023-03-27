import React, { StrictMode, useState, useTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store'
import App from './App'
import '@styles/index.less'
import '@styles/tailwind.css'

/* const importAll = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys().forEach(requireContext)
try {
  importAll(require.context('./static/icons', true, /\.svg$/))
} catch (error) {
  console.log(error)
}
 */
const rootElement = document.getElementById('root')

const root = createRoot(rootElement as Element)

/* const App = () => {
  const [count, updateCount] = useState(0)
  const [isPending, startTransition] = useTransition()

  const onClick = () => {
    // 使用了并发特性useTransition
    startTransition(() => {
      // 本次更新是并发更新
      updateCount(count => count + 1)
    })
  }
  return (
    <>
      {isPending ? 'loading' : '111'}
      <h3 onClick={onClick}>{count}</h3>
    </>
  )
} */

root.render(
  <Provider store={store}>
    {/* <StrictMode> */}
    <HashRouter>
      <App />
    </HashRouter>
    {/* </StrictMode> */}
  </Provider>
)
