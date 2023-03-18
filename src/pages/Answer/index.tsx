import React from 'react'

import Sider from './Sider'
import Content from './Content'

import styles from './index.module.less'

export default function Answer() {
  return (
    <div className={styles['content']}>
      <Sider />
      <Content />
    </div>
  )
}
