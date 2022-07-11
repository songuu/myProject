import React from 'react'
import classnames from 'classnames'
import { SkeletonImageProps } from './interface'
import styles from './index.module.less'

export default function image(props: SkeletonImageProps) {
  const {
    style,
    shape = 'square',
    size,
    position = 'left',
    className,
    prefixCls,
  } = props
  const classNames = classnames(
    styles[`${prefixCls}-image`],
    {
      [styles[`${prefixCls}-image-${position}`]]: position,
      [styles[`${prefixCls}-image-${shape}`]]: shape,
      [styles[`${prefixCls}-image-${size}`]]: size,
    },
    className
  )
  return <div className={classNames} style={style} />
}
