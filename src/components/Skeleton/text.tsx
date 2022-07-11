import React from 'react'
import classnames from 'classnames'

import { isArray } from '@utils/is'

import styles from './index.module.less'

import { SkeletonTextProps } from './interface'

export default function text(props: SkeletonTextProps) {
  const { style, width = '60%', rows = 3, className, prefixCls } = props
  const classNames = classnames(styles[`${prefixCls}-text`], className)
  const nodes = [] as JSX.Element[]

  function getTextWidth(index: number) {
    if (isArray(width)) {
      return width[index]
    }
    if (rows - 1 === index) {
      return width
    }

    return undefined
  }

  for (let i = 0; i < (rows as number); i++) {
    nodes.push(
      <li
        className={styles[`${prefixCls}-text-row`]}
        key={i}
        style={{ width: getTextWidth(i) }}
      />
    )
  }
  return (
    <ul className={classNames} style={style}>
      {nodes}
    </ul>
  )
}
