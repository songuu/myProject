import React, { FC, Suspense } from 'react'

import Router from '@router/index'

import { AppLoading } from '@components/index'

interface IAppProps {}

const App: FC<IAppProps> = () => {
  return (
    <div className="app-container">
      <Suspense fallback={<AppLoading />}>
        <Router />
      </Suspense>
    </div>
  )
}

export default App
