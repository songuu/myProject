import React from 'react'
import { createRoot } from 'react-dom/client'

import { CSSTransition, TransitionGroup } from 'react-transition-group'

import classnames from 'classnames'

import BaseNotification from '../Notification'

import Notice from '../Notice'

import { MessageProps } from './interface'

import styles from './index.module.less'

const messageTypes = [
  'info',
  'success',
  'error',
  'warning',
  'loading',
  'normal',
]

let messageInstance: any = {}

type ConfigProps = {
  maxCount?: number
  prefixCls?: string
  getContainer?: () => HTMLElement
  duration?: number
}

let maxCount: any
let prefixCls: any
let duration: any
let container: any

export interface MessageType {
  (): void
}

function addInstance(noticeProps: MessageProps) {
  const _noticeProps = {
    position: 'top',
    duration,
    ...noticeProps,
  }
  const { position, transitionClassNames } = _noticeProps
  let id: any
  if (messageInstance[position]) {
    const notices = messageInstance[position].state.notices
    if (notices.length >= maxCount) {
      const updated = notices[0]
      id = updated.id
      notices.shift()
      messageInstance[position].add({
        ..._noticeProps,
        id,
      })
    } else {
      id = messageInstance[position].add(_noticeProps)
    }
  } else {
    const div = document.createElement('div')
    ;(container || document.body).appendChild(div)

    const root = createRoot(div)

    root.render(
      // @ts-ignore
      <Message
        transitionClassNames={transitionClassNames}
        ref={(instance: any) => {
          messageInstance[position] = instance
          id = messageInstance[position].add(_noticeProps)
        }}
      />
    )
  }

  const result = () => {
    if (messageInstance[position]) {
      messageInstance[position].remove(id)
    }
  }

  return result
}

class Message extends BaseNotification {
  // 5种类型 message.info、message.success、message.error、message.warning、message.loading、message.normal
  static success: (config: MessageProps | string) => MessageType

  static info: (config: MessageProps | string) => MessageType

  static warning: (config: MessageProps | string) => MessageType

  static error: (config: MessageProps | string) => MessageType

  static loading: (config: MessageProps | string) => MessageType

  static normal: (config: MessageProps | string) => MessageType

  static config = (options: ConfigProps = {}): void => {
    if (options.maxCount) {
      maxCount = options.maxCount
    }
    if (options.prefixCls) {
      prefixCls = options.prefixCls
    }
    if (options.duration) {
      duration = options.duration
    }
    if (options.getContainer && options.getContainer() !== container) {
      container = options.getContainer()
      Object.keys(messageInstance).forEach(notice =>
        messageInstance[notice].clear()
      )
      messageInstance = {}
    }
  }

  static clear: () => void = () => {
    Object.keys(messageInstance).forEach(ins => {
      messageInstance[ins].clear()
    })
  }

  static addInstance = addInstance

  remove = (id: string) => {
    const noticeItem = this.state.notices.find(item => item.id === id)
    if (noticeItem) {
      this.update({
        ...noticeItem,
        style: { ...noticeItem.style, opacity: 0 },
      })
    }

    // 100 是透明度动画结束的时间
    setTimeout(() => {
      super.remove(id)
    }, 100)
  }

  render() {
    const { transitionClassNames } = this.props
    const { notices, position } = this.state

    const classNames = classnames(
      styles['message-wrapper'],
      styles[`message-wrapper-${position}`]
    )
    return (
      <div className={classNames}>
        <TransitionGroup component={null}>
          {notices.map(notice => {
            return (
              <CSSTransition
                key={notice.id}
                timeout={{
                  enter: 100,
                  exit: 300,
                }}
                classNames={transitionClassNames || styles.fadeMessage}
                onExit={e => {
                  e.style.height = `${e.scrollHeight}px`
                }}
                onExiting={(e: any) => {
                  e.style.height = 0
                }}
                onExited={(e: any) => {
                  e.style.height = 0
                  notice.onClose && notice.onClose()
                }}
              >
                <Notice
                  {...notice}
                  prefixCls={styles.message}
                  iconPrefix={prefixCls}
                  onClose={this.remove}
                  noticeType="message"
                  className={styles.message}
                />
              </CSSTransition>
            )
          })}
        </TransitionGroup>
      </div>
    )
  }
}

messageTypes.forEach((type: any) => {
  // @ts-ignore
  Message[type] = (noticeProps: MessageProps | string) => {
    const props =
      typeof noticeProps === 'string' ? { content: noticeProps } : noticeProps

    return addInstance({
      ...props,
      type,
    })
  }
})

export default Message
