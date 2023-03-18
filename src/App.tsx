import React, { Suspense } from 'react'

import { LightTheme, BaseProvider } from 'baseui'
import { Provider as StyletronProvider } from 'styletron-react'
import { Client as Styletron } from 'styletron-engine-atomic'

import Router from '@router/index'

import { AppLoading } from '@components/index'

const engine = new Styletron()

interface IAppProps {}

const App: React.FC<IAppProps> = () => {
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
