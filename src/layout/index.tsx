import React, { useEffect } from 'react'

import OperationHeader from './OperationHeader'
import Header from './Header'
import Content from './Content'

import Login from '@pages/Login'

interface IBaseLayoutProps {}

const BaseLayout: React.FC<IBaseLayoutProps> = () => {
  useEffect(() => {
    window.Main.on('upload-screenshots', (data: Buffer) => {
      console.log('on', data)
    })
  }, [])
  return (
    <div className="min-w-[600px] min-h-full w-full h-full overflow-hidden relative">
      <OperationHeader />
      <div className="w-full h-[calc(100%_-_30px)] overflow-hidden">
        <Header />
        <Content />
      </div>
      <Login />
    </div>
  )
}

export default BaseLayout
