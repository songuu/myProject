import React from 'react'

import classnames from 'classnames'

import { AppStore } from '@mytypes/common'

import { SvgIcon } from '@components/index'

import styles from './index.module.less'

interface IProps {
  apps: AppStore[]
  activeApp?: AppStore
  switchApp: (id?: string) => void
}

enum OssType {
  qiniu,
}

const BucketList: React.FC<IProps> = ({ apps, activeApp, switchApp }) => {
  const renderIcon = (type: OssType) => {
    switch (type) {
      case OssType.qiniu:
        return <SvgIcon iconName="qiniu" iconClass={styles['svg-icon']} />

      default:
        return null
    }
  }

  return (
    <ul className={styles['apps-main-apps']}>
      {apps.map((item: AppStore) => {
        return (
          <li
            className={classnames(
              styles['apps-main-apps-item'],
              item._id === activeApp?._id && styles.active
            )}
            key={item._id}
            onClick={() => {
              switchApp(item._id)
            }}
          >
            <div className={styles['apps-main-apps-item-btn']}>
              {renderIcon(item.type)}
              <span>{item.name}</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default BucketList
