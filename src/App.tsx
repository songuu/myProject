import React, { Suspense, useEffect } from 'react'

import { BrowserRouter } from 'react-router-dom'

import { ConfigProvider } from '@arco-design/web-react'

import { useAppSelector } from '@root/store/index'

import Router from '@router/index'

import { AppLoading } from '@components/index'

interface IAppProps {}

const App: React.FC<IAppProps> = () => {
  const theme = useAppSelector(state => state.settings.theme)

  useEffect(() => {
    switch (theme) {
      case 'light':
        document.documentElement.classList.remove('dark')
        document.body.removeAttribute('arco-theme')
        break
      case 'dark':
        document.documentElement.classList.add('dark')
        document.body.setAttribute('arco-theme', 'dark')
        break
      case 'auto':
        document.documentElement.classList.toggle(
          'dark',
          window.matchMedia('(prefers-color-scheme: dark)').matches
        )
        break
    }
  }, [theme])

  return (
    <ConfigProvider
      // locale={getArcoLocale()}
      componentConfig={{
        Card: {
          bordered: false,
        },
        List: {
          bordered: false,
        },
        Table: {
          border: false,
        },
      }}
    >
      <div className="h-[100vh]">
        <Suspense fallback={<AppLoading />}>
          <Router />
        </Suspense>
      </div>
    </ConfigProvider>
  )
}

export default App
