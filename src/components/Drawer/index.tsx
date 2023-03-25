import React, {
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
  useImperativeHandle,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import FocusLock from 'react-focus-lock'
import { findDOMNode } from 'react-dom'
import classnames from 'classnames'

import { isServerRendering, off, on } from '@utils/dom'

import { Esc } from '@utils/keycode'

import { isObject } from '@utils/is'

import useMergeProps from '@hooks/useMergeProps'

import useOverflowHidden from '@hooks/useOverflowHidden'

import Button from '../Button'
import Portal from '../Portal'
import Icon from '../Antd-Icon'

import { DrawerProps } from './interface'

import styles from './index.module.less'

const defaultProps: DrawerProps = {
  placement: 'right',
  width: 250,
  height: 250,
  escToExit: true,
  mask: true,
  closable: true,
  maskClosable: true,
  mountOnEnter: true,
  getPopupContainer: () => document.body,
}
const Drawer = (baseProps: DrawerProps, ref) => {
  const props = useMergeProps<DrawerProps>(baseProps, defaultProps)
  const {
    style,
    className,
    children,
    wrapClassName,
    maskStyle,
    headerStyle,
    bodyStyle,
    title,
    footer,
    okText,
    cancelText,
    width,
    height,
    placement,
    mask,
    visible,
    closable,
    maskClosable,
    confirmLoading,
    mountOnEnter,
    unmountOnExit,
    afterOpen,
    afterClose,
    getPopupContainer,
    escToExit,
    getChildrenPopupContainer: propGetChildrenPopupContainer,
    focusLock,
    autoFocus,
    okButtonProps,
    cancelButtonProps,
  } = props

  const drawerWrapperRef = useRef(null)
  const contentWrapperRef = useRef(null)
  const [shouldReComputeFixed, setShouldReComputeFixed] = useState(false)
  const [popupZIndex, setPopupZIndex] = useState<number>()
  const prefixCls = 'drawer'

  // Record whether is exiting, to prevent `onCancel` being unnecessarily triggered when mask is clicked during the period.
  const inExit = useRef(false)
  // Record whether it's opened to avoid element shaking during animation caused by focus lock.
  const [isOpened, setIsOpened] = useState(false)

  const getContainer = useCallback((): HTMLElement => {
    const container = getPopupContainer && getPopupContainer()
    return (findDOMNode(container) || document.body) as HTMLElement
  }, [getPopupContainer])

  const isFixed = useMemo(() => {
    return !isServerRendering && getContainer() === document.body
  }, [shouldReComputeFixed, getContainer])

  useOverflowHidden(getContainer, { hidden: !!(visible && mask) })

  useImperativeHandle(ref, () => drawerWrapperRef.current)

  useEffect(() => {
    // 初始就是展示，且设置了 getPopupContainer 时，组件挂载后重新执行下 isFixed 的计算逻辑，避免 getPopupContainer 返回的节点还未挂载，导致 isFixed 为true，样式表现错误的问题。
    if (visible && props.getPopupContainer) {
      // Recompute `isFixed` to avoid style error resulting from truthy `isFixed` value due to the custom container dom is not mounted yet.
      setShouldReComputeFixed(true)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = e => {
      if (escToExit && e && e.key === Esc.key && props.onCancel) {
        props.onCancel(e)
      }
    }

    if (visible) {
      on(document, 'keydown', onKeyDown)
    }
    return () => {
      off(document, 'keydown', onKeyDown)
    }
  }, [visible, escToExit])

  const element = (
    <div className={styles[`${prefixCls}-scroll`]}>
      {title !== null && (
        <div className={styles[`${prefixCls}-header`]} style={headerStyle}>
          <div className={styles[`${prefixCls}-header-title`]}>{title}</div>
        </div>
      )}
      {closable && (
        <div onClick={props.onCancel} className={styles[`${prefixCls}-close`]}>
          <Icon
            type="icon-guanbi"
            className={styles[`${prefixCls}-close-icon`]}
          />
        </div>
      )}

      <div
        ref={contentWrapperRef}
        style={bodyStyle}
        className={classnames(styles[`${prefixCls}-content`], {
          [styles[`${prefixCls}-content-nofooter`]]: footer === null,
          [styles[`${prefixCls}-content-noheader`]]: title === null,
        })}
      >
        {/* <ConfigProvider
          {...context}
          zIndex={popupZIndex || 1050}
          getPopupContainer={node => {
            return typeof propGetChildrenPopupContainer === 'function'
              ? propGetChildrenPopupContainer(node)
              : contentWrapperRef.current
          }}
        > */}
        {children}
        {/* </ConfigProvider> */}
      </div>

      {footer !== null &&
        (footer ? (
          <div className={styles[`${prefixCls}-footer`]}>{footer}</div>
        ) : (
          <div className={styles[`${prefixCls}-footer`]}>
            <Button onClick={props.onCancel} {...cancelButtonProps}>
              {cancelText || '取消'}
            </Button>
            <Button
              type="primary"
              loading={confirmLoading}
              onClick={props.onOk}
              {...okButtonProps}
            >
              {okText || '确定'}
            </Button>
          </div>
        ))}
    </div>
  )

  const globalFocusLockConfig = {}
  const globalFocusLock = !!globalFocusLockConfig
  const globalAutoFocus =
    isObject(globalFocusLockConfig) && globalFocusLockConfig.autoFocus
  const innerFocusLock = focusLock !== undefined ? focusLock : globalFocusLock
  const innerAutoFocus = autoFocus !== undefined ? autoFocus : globalAutoFocus

  // Only enable FocusLock when drawer is fully opened, to avoid element shaking.
  const dom = innerFocusLock ? (
    <FocusLock as="span" disabled={!isOpened} autoFocus={innerAutoFocus}>
      {element}
    </FocusLock>
  ) : (
    element
  )

  return (
    <Portal
      forceRender={!mountOnEnter}
      visible={visible}
      getContainer={getPopupContainer}
    >
      <div
        ref={drawerWrapperRef}
        className={classnames(
          styles[`${prefixCls}-wrapper`],
          {
            [styles[`${prefixCls}-no-mask`]]: !mask,
            [styles[`${prefixCls}-wrapper-hide`]]: !visible,
          },
          wrapClassName
        )}
        style={
          isFixed
            ? { position: 'fixed' }
            : { zIndex: 'inherit', position: 'absolute' }
        }
      >
        {mask ? (
          <CSSTransition
            in={visible}
            appear
            timeout={300}
            classNames="fadeInStandard"
            mountOnEnter={mountOnEnter}
            unmountOnExit={unmountOnExit}
          >
            <div
              className={styles[`${prefixCls}-mask`]}
              style={maskStyle}
              onClick={e => {
                if (!inExit.current && maskClosable) {
                  props.onCancel && props.onCancel(e)
                }
              }}
            />
          </CSSTransition>
        ) : null}

        <CSSTransition
          in={visible}
          appear
          timeout={300}
          classNames={
            {
              top: 'slideTop',
              bottom: 'slideBottom',
              left: 'slideLeft',
              right: 'slideRight',
            }[placement]
          }
          mountOnEnter={mountOnEnter}
          unmountOnExit={unmountOnExit}
          onEnter={e => {
            e.parentNode.style.display = 'block'
            inExit.current = false
          }}
          onEntered={() => {
            setIsOpened(true)
            afterOpen && afterOpen()
          }}
          onExit={() => {
            setIsOpened(false)
            inExit.current = true
          }}
          onExited={e => {
            inExit.current = false
            e.parentNode.style.display = '' // don't set display='none'
            afterClose && afterClose()
          }}
        >
          <div
            className={classnames(styles[prefixCls], className)}
            style={Object.assign(
              placement === 'left' || placement === 'right'
                ? { width }
                : { height },
              { [placement]: 0 },
              style
            )}
          >
            <div className={styles[`${prefixCls}-inner`]}>
              {/* <ConfigProvider {...context} zIndex={popupZIndex || 1050}> */}
              {dom}
              {/* </ConfigProvider> */}
            </div>
          </div>
        </CSSTransition>
      </div>
    </Portal>
  )
}

const DrawerComponent = React.forwardRef<unknown, DrawerProps>(Drawer)

DrawerComponent.displayName = 'Drawer'

export default DrawerComponent
