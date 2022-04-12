import React, { Suspense } from 'react'

import Router from '@router/index'

import { AppLoading } from '@components/index'

interface IAppProps {}

const App: React.FC<IAppProps> = () => {
  return (
    <Suspense fallback={<AppLoading />}>
      <Router />
    </Suspense>
  )
}

export default App
