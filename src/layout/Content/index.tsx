import React, { Suspense, lazy } from 'react'

import { Route, Routes, useLocation, Navigate } from 'react-router-dom'

const Home = lazy(() => import('@pages/Home'))
const Explore = lazy(() => import('@pages/Explore'))
const Library = lazy(() => import('@pages/Library'))
const Setting = lazy(() => import('@pages/Setting'))

import { PageLoading } from '@root/components'

import styles from './index.module.less'

interface IBaseContentProps { }

const Content: React.FC<IBaseContentProps> = () => {
  const location = useLocation()

  return <div className={styles['content_outer']}>
    <Suspense fallback={<PageLoading />}>
      <Routes location={location}>
        <Route path="home" element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="library" element={<Library />} />
        <Route path="setting" element={<Setting />} />
        <Route path="*" element={<Navigate to="home" />} />
      </Routes>
    </Suspense>
  </div>
}

export default Content
