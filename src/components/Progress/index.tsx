import React, { CSSProperties, forwardRef, useContext } from 'react'

import classnames from 'classnames'

import useMergeProps from '@hooks/useMergeProps'

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
  const props = useMergeProps<ProgressProps>(baseProps, defaultProps)
  const { className, style, size, width, percent, type } =
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
        styles[`progress-${type}`],
        styles.progress,
        styles[`progress-${size}`],
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
