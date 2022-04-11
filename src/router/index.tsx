import React, { Suspense } from 'react'

import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { AppLoading } from '@components/index'

type IRouterProps = {}

const Router: React.FC<IRouterProps> = props => {
  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoading />}>
        <Routes>
          <Route path="/" element={<div>首页</div>} />
          <Route path="/about" element={<div>关于</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
