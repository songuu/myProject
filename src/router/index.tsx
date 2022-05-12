import React, { FC, lazy } from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'

import { NotFound } from '@components/index'

const BaseLayout = lazy(() => import('@layout/index'))

type IRouterProps = {}

const Routers: FC<IRouterProps> = props => {
  return (
    <Routes>
      <Route index element={<Navigate to="main_window" />} />
      <Route path="main_window/*" element={<BaseLayout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Routers
