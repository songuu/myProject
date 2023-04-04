import React from 'react'

import Sider from './Sider'
import Content from './Content'

export default function Answer() {
  return (
    <div className="w-full flex pr-[24px] h-[calc(100%_-_60px)]">
      <Sider />
      <Content />
    </div>
  )
}
