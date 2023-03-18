import React, {
  useState,
  forwardRef,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react'
import FocusLock from 'react-focus-lock'

import useMergeProps from '@hooks/useMergeProps'

import useMergeValue from '@hooks/useMergeValue'

import Button from '../Button'

import Tooltip from '../Tooltip'

import { PopconfirmProps } from './interface'

import styles from './index.module.less'

const defaultProps: PopconfirmProps = {
  position: 'top',
  okType: 'primary',
  icon: null,
  blurToHide: true,
  unmountOnExit: true,
  trigger: 'click',
  escToClose: true,
}

const defaultcancelText = '取消'
const defaultokText = '确定'

const Popconfirm = (baseProps: PropsWithChildren<PopconfirmProps>, ref) => {
  const props = useMergeProps<PropsWithChildren<PopconfirmProps>>(
    baseProps,
    defaultProps
  )

  const {
    style,
    className,
    children,
    position,
    getPopupContainer,
    blurToHide,
    unmountOnExit,
    trigger,
    escToClose,
    onVisibleChange,
    triggerProps,
    title,
    icon,
    okText,
    cancelText,
    okType,
    okButtonProps,
    cancelButtonProps,
    autoFocus,
    focusLock,
    ...rest
  } = props

  const [popupVisible, setPopupVisible] = useMergeValue(false, {
    defaultValue: props.defaultPopupVisible,
    value: props.popupVisible,
  })

  const [buttonLoading, setLoading] = useState(false)
  const prefixCls = 'popconfirm'

  const handleVisibleChange = (visible: boolean) => {
    if (!('popupVisible' in props)) {
      setPopupVisible(visible)
    }
    if (triggerProps && triggerProps.onVisibleChange) {
      triggerProps.onVisibleChange(visible)
    }
    onVisibleChange && onVisibleChange(visible)
  }

  const closePopconfirm = () => {
    handleVisibleChange(false)
  }

  const onCancelPopconfirm = (e: any) => {
    e.stopPropagation()
    closePopconfirm()
    props.onCancel && props.onCancel(e)
  }

  const onConfirmPopconfirm = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    const _onConfirm = props.onOk || props.onConfirm

    let ret
    if (_onConfirm) {
      ret = _onConfirm(e)
    }
    if (ret && ret.then) {
      setLoading(true)
      ret.then(
        () => {
          closePopconfirm()
        },
        (e: Error) => {
          setLoading(false)
          console.error(e)
        }
      )
    }
    if (!ret) {
      closePopconfirm()
    }
  }

  const renderPopconfirmContent = () => {
    const element = (
      <>
        <Button onClick={onCancelPopconfirm} size="mini" {...cancelButtonProps}>
          {cancelText || defaultcancelText}
        </Button>
        <Button
          loading={buttonLoading}
          onClick={onConfirmPopconfirm}
          size="mini"
          type={okType}
          {...okButtonProps}
        >
          {okText || defaultokText}
        </Button>
      </>
    )
    return (
      <div className={styles[`${prefixCls}-wrapper`]}>
        <div className={styles[`${prefixCls}-title`]}>
          {icon && (
            <span className={styles[`${prefixCls}-title-icon`]}>{icon}</span>
          )}
          <div className={styles[`${prefixCls}-title-text`]}>{title}</div>
        </div>
        <div className={styles[`${prefixCls}-btn`]}>
          {focusLock ? (
            <FocusLock disabled={!popupVisible} autoFocus={!!autoFocus}>
              {element}
            </FocusLock>
          ) : (
            element
          )}
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!popupVisible && buttonLoading) {
      setLoading(false)
    }
    return () => {
      setLoading(false)
    }
  }, [popupVisible])

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
      escToClose={escToClose}
      popupVisible={popupVisible}
      content={renderPopconfirmContent()}
      unmountOnExit={unmountOnExit}
      blurToHide={blurToHide}
      popupHoverStay
      triggerProps={triggerProps}
      onVisibleChange={handleVisibleChange}
      childrenPrefix={prefixCls}
    >
      {typeof children === 'string' ? <span>{children}</span> : children}
    </Tooltip>
  )
}

const PopconfirmComponent = forwardRef<
  unknown,
  PropsWithChildren<PopconfirmProps>
>(Popconfirm)

PopconfirmComponent.displayName = 'Popconfirm'

export default PopconfirmComponent
