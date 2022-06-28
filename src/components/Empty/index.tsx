import React, { forwardRef, memo } from 'react'

import classnames from 'classnames'

import SvgIcon from '../SvgIcon'

import { EmptyProps } from './interface'

import styles from './index.module.less'

function Empty(baseProps: EmptyProps, ref: React.Ref<any>) {
  const { style, className, description, icon, imgSrc, title } = baseProps

  const noData = '暂无数据'

  const alt = typeof description === 'string' ? description : 'empty'

  return (
    <div
      ref={ref}
      className={classnames(styles.empty, className)}
      style={style}
    >
      <div className={styles.wrapper}>
        <div className={styles.image}>
          {imgSrc ? (
            <img alt={alt} src={imgSrc} />
          ) : (
            <SvgIcon iconName="empty" iconClass={styles['svg-icon']} />
          )}
        </div>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.description}>{description || noData}</div>
      </div>
    </div>
  )
}

const EmptyComponent = forwardRef<unknown, EmptyProps>(Empty)

EmptyComponent.displayName = 'Empty'

export default memo(EmptyComponent)
