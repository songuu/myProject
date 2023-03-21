import React, { Suspense, lazy } from 'react'

import { Route, Routes, useLocation, Navigate } from 'react-router-dom'

import { PageLoading } from '@root/components'

import styles from './index.module.less'
import Book from '@views/Book'
import Daybook from '@views/Daybook'
import Snapshot from '@views/Snapshot'
import Uploader from '@views/Uploader'
const Home = lazy(() => import('@pages/Home'))
const Explore = lazy(() => import('@pages/Explore'))
const Library = lazy(() => import('@pages/Library'))
// const Setting = lazy(() => import('@pages/Setting'))
const Answer = lazy(() => import('@root/pages/Answer'))
const Chat = lazy(() => import('@root/pages/Chat'))

interface IBaseContentProps {}

const Content: React.FC<IBaseContentProps> = () => {
  const location = useLocation()

  return (
    <div className={`${styles.content_outer} dark:bg-[#24272e]`}>
      <Suspense fallback={<PageLoading />}>
        <Routes location={location}>
          <Route path="home" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="library">
            <Route index element={<Library />} />
            <Route path="book" element={<Book />} />
            <Route path="daybook" element={<Daybook />} />
            <Route path="snapshot" element={<Snapshot />} />
            <Route path="uploader" element={<Uploader />} />
          </Route>
          {/* <Route path="setting" element={<Setting />} /> */}
          <Route path="answer" element={<Answer />} />
          <Route path="chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="home" />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default Content
