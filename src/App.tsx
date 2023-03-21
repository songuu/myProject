import React, { Suspense, useMemo, useEffect } from 'react'

import { LightTheme, DarkTheme, BaseProvider } from 'baseui'
import { Provider as StyletronProvider } from 'styletron-react'
import { Client as Styletron } from 'styletron-engine-atomic'

import { useAppSelector } from '@root/store/index'

import { useTheme } from './hooks/useTheme'

import Router from '@router/index'

import { AppLoading } from '@components/index'

const engine = new Styletron()

// const { theme } = useTheme()

interface IAppProps {}

const App: React.FC<IAppProps> = () => {
  /* const innerTheme = useMemo(() => {
    return theme === 'light' ? LightTheme : DarkTheme
  }, [theme]) */

  const theme = useAppSelector(state => state.settings.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <div className="h-[100vh]">
          <Suspense fallback={<AppLoading />}>
            <Router />
          </Suspense>
        </div>
      </BaseProvider>
    </StyletronProvider>
  )
}

export default App
