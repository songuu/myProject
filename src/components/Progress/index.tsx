import React, { CSSProperties, forwardRef, useContext } from 'react'

import classnames from 'classnames'

import LineProgress from './line-progress'

import { ProgressProps } from './interface'

import styles from './index.module.less'

const defaultProps: ProgressProps = {
  type: 'line',
  showText: true,
  percent: 0,
  size: 'default',
}

function Progress(baseProps: ProgressProps, ref: any) {
  const props = baseProps
  const { className, style, size, width, strokeWidth, steps, percent, type } =
    props

  const status =
    'status' in props ? props.status : percent >= 100 ? 'success' : 'normal'

  const widthStyle: CSSProperties = { width }

  if (size === 'mini' && type === 'line') {
    widthStyle.width = width || 16
    widthStyle.height = width || 16
  }

  return (
    <div
      ref={ref}
      className={classnames(
        styles.progress,
        styles[`progress-${size}`],
        styles[`progress-${type}`],
        status !== 'normal' && styles[`progress-is-${status}`],
        className
      )}
      style={{ ...widthStyle, ...style }}
    >
      <LineProgress {...props} status={status} prefixCls="progress" />
    </div>
  )
}

const ProgressRef = forwardRef(Progress)

ProgressRef.displayName = 'Progress'

export default ProgressRef
