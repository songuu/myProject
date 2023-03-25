import React, { Component, ReactNode, CSSProperties } from 'react'

import classnames from 'classnames'

import Icon from '../Antd-Icon'

import styles from './index.module.less'

export interface NoticeProps {
  style?: CSSProperties
  className?: string
  title?: ReactNode | string
  content?: ReactNode | string
  duration?: number
  showIcon?: boolean
  icon?: ReactNode
  id?: string
  onClose?: (id: any) => void
  position?: string
  type?: string
  btn?: ReactNode
  prefixCls?: string
  iconPrefix?: string
  noticeType?: 'message' | 'notification'
  update?: boolean
  closable?: boolean
}

class Notice extends Component<NoticeProps, {}> {
  static defaultProps = {
    type: 'info',
    showIcon: true,
    noticeType: 'message',
    duration: 3000,
  }

  // @ts-ignore
  wrapper: Element

  timer: any

  componentDidMount() {
    this.startTimer()
  }

  componentDidUpdate(nextProps: any) {
    if (nextProps.duration !== this.props.duration || this.props.update) {
      this.removeTimer()
      this.startTimer()
    }
  }

  componentWillUnmount() {
    this.removeTimer()
  }

  startTimer = () => {
    const { duration, onClose, id } = this.props
    // 自动关闭
    if (duration !== 0) {
      this.timer = window.setTimeout(() => {
        onClose && onClose(id)
        this.removeTimer()
      }, duration)
    }
  }

  removeTimer = () => {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }

  onClose: React.MouseEventHandler<HTMLSpanElement> = () => {
    this.props.onClose && this.props.onClose(this.props.id)
  }

  renderIcon = () => {
    const { showIcon, icon, type, prefixCls, iconPrefix } = this.props
    let content: ReactNode
    if (icon) {
      content = icon
    } else if (showIcon) {
      switch (type) {
        case 'success':
          content = <Icon type="icon-done" className={styles['svg-icon']} />
        case 'error':
          content = <Icon type="icon-Error" className={styles['svg-icon']} />
        case 'loading':
          content = <Icon type="icon-loading" className={styles['svg-icon']} />
        case 'info':
          content = (
            <Icon type="icon-info-circle" className={styles['svg-icon']} />
          )
        default:
          break
      }
    }

    return <span className={styles.icon}>{content}</span>
  }

  onMouseEnter = () => {
    this.removeTimer()
  }

  onMouseLeave = () => {
    this.startTimer()
  }

  render() {
    const {
      title,
      content,
      showIcon,
      className,
      style,
      type,
      btn,
      icon,
      prefixCls,
      closable,
      noticeType,
      iconPrefix,
    } = this.props

    const classNames = classnames(
      type,
      {
        [`${styles.closable}`]: closable,
      },
      className
    )

    let _closable = 'closable' in this.props ? closable : true

    let shouldRenderIcon = showIcon
    if (type === 'normal' && !icon) {
      shouldRenderIcon = false
    }

    if (noticeType === 'message') {
      _closable = closable

      return (
        <div
          style={{ textAlign: 'center' }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className={classNames} style={style} role="alert">
            {shouldRenderIcon && this.renderIcon()}
            <span className={styles.content}>{content}</span>
            {_closable && 123}
          </div>
        </div>
      )
    }
  }
}

export default Notice
