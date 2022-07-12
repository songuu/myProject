import React, {
  ReactNode,
  forwardRef,
  useRef,
  PropsWithChildren,
  useImperativeHandle,
} from 'react'

import classnames from 'classnames'

import useMergeProps from '@hooks/useMergeProps'

import pick from '@utils/pick'

import Trigger, { EventsByTriggerNeed } from '../Trigger'

import { TooltipProps } from './interface'

export type TooltipHandle = {
  updatePopupPosition: () => void
}

const defaultProps: TooltipProps = {
  position: 'top',
  trigger: 'hover',
  escToClose: false,
  unmountOnExit: true,
  blurToHide: true,
  popupHoverStay: true,
}

function Tooltip(baseProps: PropsWithChildren<TooltipProps>, ref) {
  const props = useMergeProps<PropsWithChildren<TooltipProps>>(
    baseProps,
    defaultProps
  )

  const {
    style,
    className,
    children,
    trigger,
    escToClose,
    defaultPopupVisible,
    position,
    unmountOnExit,
    popupVisible,
    prefixCls: tooltipPrefixCls,
    blurToHide,
    popupHoverStay,
    disabled,
    onVisibleChange,
    triggerProps,
    childrenPrefix,
    getPopupContainer,
    content,
    mini,
    color,
    ...rest
  } = props

  const refTrigger = useRef<Trigger>()

  const updatePopupPosition = (delay = 0, callback?: () => void) => {
    refTrigger.current &&
      refTrigger.current.updatePopupPosition(delay, callback)
  }

  useImperativeHandle<any, TooltipHandle>(
    ref,
    () => ({
      updatePopupPosition,
    }),
    []
  )

  const prefixCls = `${tooltipPrefixCls}-tooltip`

  const otherProps: any = {
    ...pick(rest, EventsByTriggerNeed),
    ...triggerProps,
  }

  const renderedContent = typeof content === 'function' ? content() : content

  const isEmpty = (content: ReactNode): boolean => {
    if (content === null || content === undefined || content === false) {
      return true
    }
    if (typeof content === 'string' && content.trim() === '') {
      return true
    }
    return false
  }

  if ('popupVisible' in props) {
    otherProps.popupVisible = popupVisible
  } else if (isEmpty(renderedContent)) {
    otherProps.popupVisible = false
  }

  return <>123</>
}

const TooltipComponent = forwardRef<
  TooltipHandle,
  PropsWithChildren<TooltipProps>
>(Tooltip)

TooltipComponent.displayName = 'Tooltip'

export default TooltipComponent
