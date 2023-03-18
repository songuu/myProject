import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  forwardRef,
} from 'react'

import classnames from 'classnames'

import { SvgIcon } from '@components/index'

import useMergeProps from '@hooks/useMergeProps'

import styles from './index.module.less'

import Group from './group'

import { ButtonProps } from './interface'

const defaultProps: ButtonProps = {
  htmlType: 'button',
  type: 'default',
  shape: 'square',
}

const regexTwoCNChar = /^[\u4e00-\u9fa5]{2}$/

function processChildren(children?: ReactNode) {
  const childrenList: any = []
  let isPrevChildPure = false
  React.Children.forEach(children, child => {
    const isCurrentChildPure =
      typeof child === 'string' || typeof child === 'number'
    if (isCurrentChildPure && isPrevChildPure) {
      const lastIndex = childrenList.length - 1
      const lastChild = childrenList[lastIndex]
      childrenList[lastIndex] = `${lastChild}${child}`
    } else {
      childrenList.push(child)
    }
    isPrevChildPure = isCurrentChildPure
  })
  return React.Children.map(childrenList, child =>
    typeof child === 'string' ? <span>{child}</span> : child
  )
}
const Button = (baseProps: ButtonProps, ref) => {
  const props = useMergeProps<ButtonProps>(baseProps, defaultProps)

  const {
    style,
    className,
    children,
    htmlType,
    type,
    status,
    size = 'default',
    shape,
    href,
    anchorProps,
    disabled,
    loading,
    loadingFixedWidth,
    icon,
    iconOnly,
    onClick,
    long,
    ...rest
  } = props
  const iconNode = loading ? (
    <SvgIcon iconName="loading" iconClass={styles['svg-icon']} />
  ) : (
    icon
  )

  const [isTwoCNChar, setIsTwoCNChar] = useState(false)
  const innerButtonRef = useRef()
  const buttonRef = ref || innerButtonRef

  useEffect(() => {
    if (buttonRef && buttonRef.current) {
      const textContent = buttonRef.current.textContent
      if (regexTwoCNChar.test(textContent)) {
        if (!isTwoCNChar) {
          setIsTwoCNChar(true)
        }
      } else if (isTwoCNChar) {
        setIsTwoCNChar(false)
      }
    }
  }, [buttonRef.current])

  const prefixCls = 'btn'
  const _type = type === 'default' ? 'secondary' : type

  const classNames = classnames(
    styles[prefixCls],
    styles[`${prefixCls}-${_type}`],
    styles[`${prefixCls}-size-${size}`],
    styles[`${prefixCls}-shape-${shape}`],
    {
      [styles[`${prefixCls}-long`]]: long,
      [styles[`${prefixCls}-status-${status}`]]: status,
      [styles[`${prefixCls}-loading-fixed-width`]]: loadingFixedWidth,
      [styles[`${prefixCls}-loading`]]: loading,
      [styles[`${prefixCls}-link`]]: href,
      [styles[`${prefixCls}-icon-only`]]:
        iconOnly || (!children && children !== 0 && iconNode),
      [styles[`${prefixCls}-disabled`]]: disabled,
      [styles[`${prefixCls}-two-chinese-chars`]]: isTwoCNChar,
      [styles[`${prefixCls}-rtl`]]: 'left',
    },
    className
  )

  const handleClick: React.MouseEventHandler<HTMLElement> = (
    event: any
  ): void => {
    if (loading) {
      typeof event?.preventDefault === 'function' && event.preventDefault()
      return
    }
    onClick && onClick(event)
  }

  const InnerContent = (
    <>
      {iconNode}
      {processChildren(children)}
    </>
  )

  if (href) {
    const _anchorProps = { ...anchorProps }
    if (disabled) {
      delete _anchorProps.href
    } else {
      _anchorProps.href = href
    }
    return (
      <a
        ref={buttonRef}
        {...rest}
        {..._anchorProps}
        style={style}
        className={classNames}
        onClick={handleClick}
      >
        {InnerContent}
      </a>
    )
  }

  return (
    <button
      ref={buttonRef}
      {...rest}
      style={style}
      className={classNames}
      type={htmlType}
      disabled={disabled}
      onClick={handleClick}
    >
      {InnerContent}
    </button>
  )
}

const ForwardRefButton = forwardRef<unknown, ButtonProps>(Button)

const ButtonComponent = ForwardRefButton as typeof ForwardRefButton & {
  __BYTE_BUTTON: boolean
  Group: typeof Group
}

ButtonComponent.__BYTE_BUTTON = true

ButtonComponent.Group = Group

ButtonComponent.displayName = 'Button'

export default ButtonComponent
