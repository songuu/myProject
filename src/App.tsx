import React, { Suspense } from 'react'

import Router from '@router/index'

import { AppLoading } from '@components/index'

interface IAppProps {}

const App: React.FC<IAppProps> = () => {
  return (
    <>
      {/* <Suspense fallback={'加载中1...'}>
        <div>1</div>
      </Suspense>
      <Suspense fallback={'加载中2...'}>
        <div>2</div>
      </Suspense>
      <Suspense fallback={'加载中3...'}>
        <div>3</div>
      </Suspense> */}
      <Suspense fallback={<AppLoading />}>
        <Router />
      </Suspense>
    </>
  )
}

export default App
