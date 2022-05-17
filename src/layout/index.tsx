import React, { useEffect } from 'react'

import OperationHeader from './OperationHeader'
import Header from './Header'
import Content from './Content'

import Login from '@pages/Login'

import styles from './index.module.less'

interface IBaseLayoutProps {}

const BaseLayout: React.FC<IBaseLayoutProps> = () => {
  useEffect(() => {
    window.Main.on('upload-screenshots', (data: Buffer) => {
      console.log('on', data)
    })
  }, [])
  return (
    <div
      className={styles.outContainer}
      style={{ minHeight: '100%', width: '100%' }}
    >
      <OperationHeader />
      <div className={styles.innerContainer}>
        <Header></Header>
        <Content></Content>
      </div>
      <Login />
    </div>
  )
}

export default BaseLayout
