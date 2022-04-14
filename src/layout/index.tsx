import React from 'react'

import OperationHeader from './OperationHeader'
import Header from './Header'
import Content from './Content'
import Sider from './Sider'

import styles from './index.module.less'

interface IBaseLayoutProps {}

/*
 * 目前的展示形式是：
 *  1. 左侧是应用列表，右侧是应用详情和管理
 *
 */
const BaseLayout: React.FC<IBaseLayoutProps> = () => {
  return (
    <div
      className={styles.outContainer}
      style={{ minHeight: '100%', width: '100%' }}
    >
      <OperationHeader />
      <div className={styles.innerContainer}>
        <Sider></Sider>
        <div className={styles.innerContainerMain}>
          <Header></Header>
          <Content></Content>
        </div>
      </div>
    </div>
  )
}

export default BaseLayout
