import React from 'react'

import OperationHeader from './OperationHeader'
import Header from './Header'
import Content from './Content'

import styles from './index.module.less'

interface IBaseLayoutProps {}

const BaseLayout: React.FC<IBaseLayoutProps> = () => {
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
    </div>
  )
}

export default BaseLayout
