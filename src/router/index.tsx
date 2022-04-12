import React, { FC, lazy } from 'react'

import { useRoutes, useLocation } from 'react-router-dom'

const BaseLayout = lazy(() => import('@layout/index'))

import { NotFound } from '@components/index'

type IRouterProps = {}

const Routers: FC<IRouterProps> = props => {
  const location = useLocation()

  return useRoutes([
    {
      path: '/main_window',
      element: <BaseLayout />,
    },
    { path: '*', element: <NotFound /> },
  ])
}

export default Routers
