import React, { PropsWithChildren } from 'react'
import classnames from 'classnames'
import { BreadCrumbItemProps } from './interface'
import styles from './index.module.less'

function Item(props: PropsWithChildren<BreadCrumbItemProps>) {
  const { children, style, className, prefixCls } = props

  const dom = (
    <div
      role="listitem"
      style={style}
      className={classnames(styles[`${prefixCls}-item`], className)}
    >
      {children}
    </div>
  )

  return dom
}

Item.displayName = 'BreadcrumbItem'

export default Item
