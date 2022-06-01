import React from 'react'

import { Layout } from '@mytypes/common'

import styles from './index.module.less'

interface PropTypes {
  backspace: () => void
  onChangeLayout: () => void
  layout: Layout
  navigators: string[]
  onSearchChange: (value: string) => void
  onRefreshBucket: () => void
}

const HeaderToolbar: React.FC<PropTypes> = () => {
  return (
    <div className={styles['toolbar-wrapper']}>
      <div className={styles['toolbar-left']}></div>
      <div className={styles['toolbar-right']}></div>
    </div>
  )
}

export default HeaderToolbar
