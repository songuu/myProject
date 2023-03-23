import React from 'react'

import { Route, Routes } from 'react-router-dom'

import Sider from './components/sider'

import Content from './components/content'

function Chat() {
  return (
    <div className="h-full transition-all p-0">
      <div className="h-full overflow-hidden border rounded-md shadow-md dark:border-neutral-800">
        <div className="z-40 flex h-full transition">
          <Sider />
          <div className="flex-1 h-full">
            <Routes>
              <Route path="/" element={<Content />}>
                <Route path=":id" element={<Content />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
