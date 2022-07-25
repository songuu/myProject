import React, { forwardRef, PropsWithChildren, useContext } from 'react'

import classnames from 'classnames'

import useMergeProps from '@hooks/useMergeProps'

import Tooltip from '../Tooltip'

import { PopoverProps } from './interface'

import styles from './index.module.less'

const defaultProps: PopoverProps = {
  position: 'top',
  trigger: 'hover',
  unmountOnExit: true,
}

const Popover = (baseProps: PropsWithChildren<PopoverProps>, ref) => {
  const props = useMergeProps<PropsWithChildren<PopoverProps>>(
    baseProps,
    defaultProps
  )

  const {
    style,
    className,
    children,
    position,
    getPopupContainer,
    trigger,
    defaultPopupVisible,
    popupVisible,
    triggerProps,
    unmountOnExit,
    onVisibleChange,
    content = '',
    title,
    ...rest
  } = props

  const prefixCls = 'popover'

  const innerContent = typeof content === 'function' ? content() : content

  return (
    <Tooltip
      {...rest}
      ref={ref}
      style={{
        maxWidth: 350,
        ...style,
      }}
      className={className}
      prefixCls={prefixCls}
      getPopupContainer={getPopupContainer}
      position={position}
      trigger={trigger}
      content={
        <div className={styles[`${prefixCls}-inner`]}>
          {title ? (
            <div className={styles[`${prefixCls}-title`]}>{title}</div>
          ) : null}
          <div className={styles[`${prefixCls}-inner-content`]}>
            {innerContent}
          </div>
        </div>
      }
      popupHoverStay
      unmountOnExit={unmountOnExit}
      triggerProps={triggerProps}
      defaultPopupVisible={defaultPopupVisible}
      onVisibleChange={
        onVisibleChange ||
        (triggerProps ? triggerProps.onVisibleChange : undefined)
      }
      childrenPrefix={prefixCls}
      {...('popupVisible' in props ? { popupVisible } : {})}
    >
      {typeof children === 'string' ? <span>{children}</span> : children}
    </Tooltip>
  )
}

const PopoverComponent = forwardRef<unknown, PropsWithChildren<PopoverProps>>(
  Popover
)

PopoverComponent.displayName = 'Popover'

export default PopoverComponent
