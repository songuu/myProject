import React from 'react'

import { Layout } from '@mytypes/common'

import { SvgIcon, ButtonIcon } from '@components/index'

import styles from './index.module.less'

interface PropTypes {
  backspace: () => void
  onChangeLayout: () => void
  layout: Layout
  navigators: string[]
  onSearchChange: (value: string) => void
  onRefreshBucket: () => void
}

const HeaderToolbar: React.FC<PropTypes> = ({ onRefreshBucket }) => {
  return (
    <div className={styles['toolbar-wrapper']}>
      <div className={styles['toolbar-left']}>
        <ButtonIcon onclick={() => {}}>
          <SvgIcon iconName="arrow-left" iconClass={styles['svg-icon']} />
        </ButtonIcon>
        <ButtonIcon onclick={onRefreshBucket}>
          <SvgIcon iconName="reload" iconClass={styles['svg-icon']} />
        </ButtonIcon>
        <div className={styles.breadcrumb}></div>
      </div>
      <div className={styles['toolbar-right']}>搜索</div>
    </div>
  )
}

export default HeaderToolbar
