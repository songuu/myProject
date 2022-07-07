import React, { forwardRef, useState, useCallback, useEffect } from 'react'

import { debounce } from 'lodash'

import classnames from 'classnames'

import useMergeProps from '@hooks/useMergeProps'

import SvgIcon from '../SvgIcon'

import DotLoading from './dot-loading'

import styles from './index.module.less'

import { SpinProps } from './interface'

import loadingGif from '@imgs/loading.gif'

function Spin(baseProps: SpinProps, ref: any) {
  const props = useMergeProps<SpinProps>(baseProps, {})

  const {
    style,
    className,
    children,
    loading: propLoading,
    size,
    icon,
    element,
    tip,
    dot,
    delay,
    block = false,
  } = props

  const prefixCls = 'spin'

  const [loading, setLoading] = useState<boolean>(
    delay ? false : propLoading ?? false
  )
  const debouncedSetLoading = useCallback(debounce(setLoading, delay), [delay])

  useEffect(() => {
    delay && debouncedSetLoading(propLoading ?? false)
    return () => {
      debouncedSetLoading && debouncedSetLoading.cancel()
    }
  }, [propLoading])

  const _usedLoading = delay ? loading : propLoading

  const loadingIcon = (
    <span className={`${prefixCls}-icon`}>
      {icon
        ? React.cloneElement(icon as React.ReactElement, {
            className: classnames(
              styles[`${prefixCls.replace('-spin', '-icon')}-loading`]
            ),
            style: {
              fontSize: size,
            },
          })
        : element || (dot ? <DotLoading size={size} /> : <img src={loadingGif} />)}
    </span>
  )

  return (
    <div
      ref={ref}
      className={classnames(
        prefixCls,
        {
          [styles[`${prefixCls}-block`]]: block,
          [styles[`${prefixCls}-loading`]]: _usedLoading,
          [styles[`${prefixCls}-with-tip`]]: tip && !children,
        },
        className
      )}
      style={style}
    >
      {children ? (
        <>
          <div className={styles[`${prefixCls}-children`]}>{children}</div>
          {_usedLoading && (
            <div
              className={styles[`${prefixCls}-loading-layer`]}
              style={{ fontSize: size }}
            >
              <span className={styles[`${prefixCls}-loading-layer-inner`]}>
                {loadingIcon}
                {tip ? (
                  <div className={styles[`${prefixCls}-tip`]}>{tip}</div>
                ) : null}
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          {loadingIcon}
          {tip ? <div className={styles[`${prefixCls}-tip`]}>{tip}</div> : null}
        </>
      )}
    </div>
  )
}

const SpinComponent = forwardRef<unknown, SpinProps>(Spin)

export default SpinComponent
