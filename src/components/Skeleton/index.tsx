import React, { forwardRef,  PropsWithChildren } from 'react'

import classnames from 'classnames'

import { isObject } from '@utils/is'

import useMergeProps from '@hooks/useMergeProps'

import Image from './image'

import Text from './text'

import { SkeletonProps } from './interface'

import styles from './index.module.less'

function getComponentProps(prop) {
  return isObject(prop) ? prop : {}
}

const defaultProps: SkeletonProps = {
  text: true,
  loading: true,
}

function Skeleton(baseProps: PropsWithChildren<SkeletonProps>, ref) {
  const props = useMergeProps<PropsWithChildren<SkeletonProps>>(
    baseProps,
    defaultProps
  )

  const { style, className, animation, loading, image, text, children } = props

  const imageProps = getComponentProps(image)
  const textProps = getComponentProps(text)

  const prefixCls = 'skeleton'
  const classNames = classnames(
    [styles[prefixCls]],
    {
      [styles[`${prefixCls}-animate`]]: animation,
    },
    className
  )

  function renderImage() {
    return (
      image && (
        <div className={`${prefixCls}-header`}>
          <Image prefixCls={prefixCls} {...imageProps} />
        </div>
      )
    )
  }

  function renderText() {
    return (
      text && (
        <div className={styles[`${prefixCls}-content`]}>
          <Text prefixCls={prefixCls} {...textProps} />
        </div>
      )
    )
  }

  return (
    <>
      {loading ? (
        <div className={classNames} style={style} ref={ref}>
          {imageProps.position !== 'right' && renderImage()}
          {renderText()}
          {imageProps.position === 'right' && renderImage()}
        </div>
      ) : (
        children
      )}
    </>
  )
}

const SkeletonComponent = forwardRef<unknown, PropsWithChildren<SkeletonProps>>(
  Skeleton
)

export default SkeletonComponent
