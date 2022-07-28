import React, { useMemo } from 'react'

import { Layout } from '@mytypes/common'

import { SvgIcon, ButtonIcon, Breadcrumb } from '@components/index'

import styles from './index.module.less'

interface PropTypes {
  backspace: () => void
  onChangeLayout: () => void
  layout: Layout
  navigators: string[]
  onSearchChange: (value: string) => void
  onRefreshBucket: () => void
}

const HeaderToolbar: React.FC<PropTypes> = ({
  onRefreshBucket,
  navigators,
  backspace,
}) => {
  const myNavigators = () => {
    return ['首页'].concat(navigators)
  }
  return (
    <div className={styles['toolbar-wrapper']}>
      <div className={styles['toolbar-left']}>
        <ButtonIcon onclick={backspace}>
          <SvgIcon iconName="arrow-left" iconClass={styles['svg-icon']} />
        </ButtonIcon>
        <ButtonIcon onclick={onRefreshBucket}>
          <SvgIcon iconName="reload" iconClass={styles['svg-icon']} />
        </ButtonIcon>
        <Breadcrumb separator=">">
          {myNavigators().map((item, index) => {
            return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
          })}
        </Breadcrumb>
        {/* <div className={styles.breadcrumb}>
          {myNavigators().map((item, index) => {
            return (
              <div className={styles['breadcrumb_item']} key={item}>
                <span className={styles['breadcrumb_item_a']}>{item}</span>
                {index !== myNavigators().length - 1 &&
                  myNavigators().length !== 1 && <span className={styles['breadcrumb_item_block']}>{'>'}</span>}
              </div>
            )
          })}
        </div> */}
      </div>
      <div className={styles['toolbar-right']}>搜索</div>
    </div>
  )
}

export default HeaderToolbar
