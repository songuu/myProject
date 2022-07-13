import React, {
  PureComponent,
  CSSProperties,
  PropsWithChildren,
  ReactElement,
} from 'react'

import { findDOMNode } from 'react-dom'

import ResizeObserverPolyfill from 'resize-observer-polyfill'

import mergeProps from '@utils/mergeProps'

import { isFunction } from '@utils/is'

import { on, off, contains, getScrollElements } from '@utils/dom'

import { raf, caf } from '@utils/raf'

import throttleByRaf from '@utils/throttleByRaf'

import { Esc } from '@utils/keycode'

import getStyle from './getPopupStyle'

import { TriggerProps, MouseLocationType } from './interface'

export interface TriggerState {
  popupVisible: boolean
  popupStyle: object
}

function getDOMPos(dom: HTMLElement) {
  if (!dom) {
    return {}
  }
  const { width, height, left, right } = dom.getBoundingClientRect()
  return {
    width,
    height,
    left,
    right,
  }
}

function splitChildrenStyle(
  obj: CSSProperties,
  keys: string[]
): { picked: CSSProperties; omitted: CSSProperties } {
  const picked: CSSProperties = {}
  const omitted: CSSProperties = { ...obj }
  keys.forEach((key: string) => {
    if (obj && key in obj) {
      // @ts-ignore
      picked[key] = obj[key]
      // @ts-ignore
      delete omitted[key]
    }
  })
  return { picked, omitted }
}

class Trigger extends PureComponent<TriggerProps, TriggerState> {
  static getDerivedStateFromProps(nextProps: any, state: any) {
    if (
      'popupVisible' in nextProps &&
      nextProps.popupVisible !== state.popupVisible
    ) {
      return {
        popupVisible: nextProps.popupVisible,
      }
    }
    return null
  }

  popupContainer: any

  triggerRef!: HTMLSpanElement | null

  delayTimer: any = null

  updatePositionTimer: any

  // popup 真正出现的位置
  realPosition!: string

  // arrow 箭头的位置
  arrowStyle!: CSSProperties

  // is popup open?
  popupOpen = false

  // if mousedown to hide popup, ignore onFocus
  mousedownToHide = false

  mouseDownTimeout: any

  hasPopupMouseDown = false

  // handle click outside document
  handleClickOutside!: boolean

  // 是否监听了window 的resize
  handleWindowResize!: boolean

  unmount = false

  // 保存鼠标的位置
  mouseLocation: MouseLocationType = {
    clientX: 0,
    clientY: 0,
  }

  // 保存当前的mount container dom元素
  observerContainer = null

  // 保存当前节点到 popupContainer 间的所有滚动元素
  scrollElements: HTMLElement[] & any = null

  // container 触发 resize时执行
  resizeObserver = new ResizeObserverPolyfill(() => {
    this.handleUpdatePosition()
  })

  childrenDom: any = null

  // 保存children节点的尺寸。 主要用于在弹出层动画前和动画完成后比较尺寸是否有变化。
  childrenDomSize: ReturnType<typeof getDOMPos> = {}

  rafId: number = 0

  getMergedProps = (baseProps?: any): PropsWithChildren<TriggerProps> => {
    const props = mergeProps<PropsWithChildren<TriggerProps>>(
      baseProps || this.props,
      {}
    )
    return props
  }

  constructor(props: any, context: any) {
    super(props, context)

    const mergedProps = this.getMergedProps(props)

    const popupVisible =
      'popupVisible' in mergedProps
        ? mergedProps.popupVisible
        : mergedProps.defaultPopupVisible
    this.popupOpen = !!popupVisible

    this.state = {
      popupVisible: props.popupVisible,
      popupStyle: {},
    }
  }

  getRootElement = (): HTMLElement => {
    return findDOMNode(this) as HTMLElement
  }

  isDidMount = false

  componentDidMount() {
    // @ts-ignore
    this.componentDidUpdate(this.getMergedProps())
    this.isDidMount = true

    this.childrenDom = findDOMNode(this)
    if (this.state.popupVisible) {
      this.childrenDomSize = getDOMPos(this.childrenDom)
    }
  }

  componentDidUpdate(_prevProps: any) {
    const prevProps = this.getMergedProps(_prevProps)

    const currentProps = this.getMergedProps()

    if (!prevProps.popupVisible && currentProps.popupVisible) {
      this.update()
    }

    const { popupVisible } = this.state

    this.popupOpen = !!popupVisible

    const { getDocument } = currentProps

    if (!popupVisible) {
      this.offClickOutside()
      this.offContainerResize()
      this.offWindowResize()
      this.offScrollListeners()
      return
    }

    const rect = getDOMPos(this.childrenDom)
    // children节点的尺寸改变，主要是处理children 存在scale等动画属性，或者移动位置的时候，popup 的位置有问题
    if (JSON.stringify(rect) !== JSON.stringify(this.childrenDomSize)) {
      this.updatePopupPosition()
      this.childrenDomSize = rect
    }
    // popupVisible为true
    this.onContainerResize()
    if (currentProps.updateOnScroll || currentProps.containerScrollToClose) {
      this.onContainersScroll()
    }
    if (!this.handleWindowResize) {
      on(window, 'resize', this.handleUpdatePosition)
      this.handleWindowResize = true
    }

    if (!this.handleClickOutside) {
      const root = isFunction(getDocument) && (getDocument as Function)()
      if (root) {
        // clickOutside 必须监听mousedown。
        // 1. 如果事件目标元素在click后被移除，document.onclick被触发时已经没有该元素，会错误触发clickOutside逻辑，隐藏popup。
        // 2. 点击label标签，会触发对应input元素的点击事件，导致触发clickOutside，隐藏popup。
        on(root, 'mousedown', this.onClickOutside)
        this.handleClickOutside = true
      }
    }
  }

  componentWillUnmount() {
    this.unmount = true
    this.offClickOutside()
    this.clearTimer()
    this.offWindowResize()
    this.offScrollListeners()
    this.offContainerResize()
    caf(this.rafId)
  }

  clearTimer = () => {
    if (this.updatePositionTimer) {
      if (this.updatePositionTimer.cancel) {
        this.updatePositionTimer.cancel()
      } else {
        clearTimeout(this.updatePositionTimer)
        this.updatePositionTimer = null
      }
    }
    if (this.delayTimer) {
      clearTimeout(this.delayTimer)
      this.delayTimer = null
    }
    if (this.mouseDownTimeout) {
      clearTimeout(this.mouseDownTimeout)
      this.mouseDownTimeout = null
    }
  }

  // getPopupContainer 改变时候触发
  handleUpdatePosition = throttleByRaf(() => {
    this.updatePopupPosition()
  })

  isClickTrigger = () => {
    const { trigger } = this.getMergedProps()
    // @ts-ignore
    return [].concat(trigger).indexOf('click') > -1
  }

  isFocusTrigger = () => {
    const { trigger } = this.getMergedProps()
    // @ts-ignore
    return [].concat(trigger).indexOf('focus') > -1
  }

  isHoverTrigger = () => {
    const { trigger } = this.getMergedProps()
    // @ts-ignore
    return [].concat(trigger).indexOf('hover') > -1
  }

  isContextMenuTrigger = () => {
    const { trigger } = this.getMergedProps()
    // @ts-ignore
    return [].concat(trigger).indexOf('contextMenu') > -1
  }

  // 是否在鼠标移出触发节点和popup的时候隐藏弹出层
  isMouseLeaveToClose = () => {
    return this.isHoverTrigger() && this.getMergedProps().mouseLeaveToClose
  }

  // 是否在悬浮到popup的时候隐藏弹出层
  isPopupHoverHide = () => {
    return this.isHoverTrigger() && !this.getMergedProps().popupHoverStay
  }

  isClickToHide = () => {
    return (
      (this.isClickTrigger() || this.isContextMenuTrigger()) &&
      this.getMergedProps().clickToClose
    )
  }

  isBlurToHide = () => {
    return this.isFocusTrigger() && this.getMergedProps().blurToHide
  }

  offClickOutside = () => {
    if (this.handleClickOutside) {
      const { getDocument } = this.getMergedProps()
      const root = isFunction(getDocument) && (getDocument as Function)()

      off(root, 'mousedown', this.onClickOutside)
      this.handleClickOutside = false
    }
  }

  offContainerResize = () => {
    if (this.resizeObserver && this.observerContainer) {
      this.resizeObserver.unobserve(this.observerContainer)
      this.observerContainer = null
    }
  }

  offWindowResize = () => {
    this.handleWindowResize = false
    off(window, 'resize', this.handleUpdatePosition)
  }

  offScrollListeners = () => {
    ;(this.scrollElements || []).forEach((item: any) => {
      off(item, 'scroll', this.handleScroll)
    })
    this.scrollElements = null
  }

  updatePopupPosition = (delay = 0, callback?: () => void) => {
    const currentVisible = this.state.popupVisible
    if (!currentVisible) {
      return
    }
    if (delay < 4) {
      this.updatePositionTimer = this.update(callback)
      return
    }
    this.updatePositionTimer = setTimeout(() => {
      const popupStyle = this.getPopupStyle()

      this.setState(
        {
          popupStyle,
        },
        () => {
          callback && callback()
        }
      )
    }, delay)
  }

  getPopupStyle = (): any => {
    if (this.unmount || !this.popupContainer) {
      return
    }
    const mountContainer = this.popupContainer as Element
    const content = findDOMNode(this.triggerRef) as HTMLElement
    const child: HTMLElement = findDOMNode(this) as HTMLElement
    const { style, arrowStyle, realPosition } = getStyle(
      this.getMergedProps(),
      content,
      child,
      mountContainer,
      this.mouseLocation
    )
    this.realPosition =
      realPosition || (this.getMergedProps().position as string)
    this.arrowStyle = arrowStyle || {}

    return {
      ...style,
      ...this.getTransformOrigin(this.realPosition),
    }
  }

  getTransformOrigin = (position: any) => {
    const content = findDOMNode(this.triggerRef) as HTMLElement
    if (!content) return {}

    const { showArrow, classNames } = this.getMergedProps()
    let top = (showArrow && this.arrowStyle?.top) || 0
    let left = (showArrow && this.arrowStyle?.left) || 0
    top = top ? `${top}px` : ''
    left = left ? `${left}px` : ''

    const transformOrigin: any = {
      top: `${left || '50%'} 100% 0`,
      tl: `${left || '15px'} 100% 0`,
      tr: `${left || `${content.clientWidth - 15}px`} 100% 0`,
      bottom: `${left || '50%'} 0 0`,
      bl: `${left || '15px'} 0 0`,
      br: `${left || `${content.clientWidth - 15}px`} 0 0`,
      left: `100% ${top || '50%'} 0`,
      lt: `100% ${top || '15px'} 0`,
      lb: `100% ${top || `${content.clientHeight - 15}px`} 0`,
      right: `0 ${top || '50%'} 0`,
      rt: `0 ${top || '15px'} 0`,
      rb: `0 ${top || `${content.clientHeight - 15}px`} 0`,
    }

    // tooltip popover popconfirm
    if (classNames && classNames.indexOf('zoom') > -1) {
      return {
        transformOrigin: transformOrigin[position],
      }
    }
    if (classNames === 'slideDynamicOrigin') {
      let origin = '0% 0%'
      if (['top', 'tl', 'tr'].indexOf(position) > -1) {
        origin = '100% 100%'
      }
      return {
        transformOrigin: origin,
      }
    }
    return {}
  }

  onContainerResize = () => {
    // containerParent 相当于是通过getPopupContainer传入的节点
    // 因为 this.popupContainer 会被挂载到getPopupContainer返回的节点上
    const containerParent = this.popupContainer?.parentNode
    if (this.resizeObserver && this.observerContainer !== containerParent) {
      // 说明containerParent变了，取消之前的监听，监听新的container
      this.offContainerResize()
      containerParent && this.resizeObserver.observe(containerParent)
      this.observerContainer = containerParent
    }
  }

  onContainersScroll = () => {
    if (this.scrollElements) {
      return
    }
    this.scrollElements = getScrollElements(
      this.childrenDom,
      this.popupContainer?.parentNode
    )

    this.scrollElements.forEach((item: any) => {
      on(item, 'scroll', this.handleScroll)
    })
  }

  onClickOutside = (e: any) => {
    const { onClickOutside, clickOutsideToClose } = this.getMergedProps()
    const triggerNode = findDOMNode(this.triggerRef)
    const childrenDom = findDOMNode(this)

    if (
      !contains(triggerNode, e.target) &&
      !contains(childrenDom, e.target) &&
      !this.hasPopupMouseDown
    ) {
      onClickOutside && onClickOutside()
      if (clickOutsideToClose) {
        // 以下判断条件避免onVisibleChange触发两次
        // blurToHide 为true时不需要执行，因为onBlur里会执行setPopupVisible
        // hover 触发方式，不执行以下逻辑。因为mouseLeave里会执行setPopupVisible
        if (!this.isBlurToHide() && !this.isHoverTrigger()) {
          this.setPopupVisible(false)
        }
      }
    }
  }

  clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer)
      this.delayTimer = null
    }
  }

  // 当 children 中的元素 disabled 时，不能正确触发 hover 等事件，所以当监测到对应
  // 组件有 disabled 时，给元素加一层 span，处理事件，模拟样式
  getChild = () => {
    const { children }: any = this.props

    const element = children as ReactElement
    const elementType = (element &&
      typeof element !== 'string' &&
      element.type) as any
    let child = children

    if (
      ['string', 'number'].indexOf(typeof children) > -1 ||
      React.Children.count(children) > 1
    ) {
      child = <span>{children}</span>
    } else if (
      element &&
      elementType &&
      (elementType.__BYTE_BUTTON === true ||
        elementType.__BYTE_CHECKBOX === true ||
        elementType.__BYTE_SWITCH === true ||
        elementType.__BYTE_RADIO === true ||
        elementType === 'button') &&
      element.props.disabled
    ) {
      // 从样式中提取出会影响布局的到上层 span 样式中。
      const { picked, omitted } = splitChildrenStyle(element.props.style, [
        'position',
        'left',
        'right',
        'top',
        'bottom',
        'float',
        'display',
        'zIndex',
      ])
      child = (
        <span
          className={element.props.className}
          style={{ display: 'inline-block', ...picked, cursor: 'not-allowed' }}
        >
          {React.cloneElement(element, {
            style: {
              ...omitted,
              pointerEvents: 'none',
            },
            className: undefined,
          })}
        </span>
      )
    }

    // 防止为空报错
    return child || <span />
  }

  // 1. 触发直接附加到 Trigger 上的事件，大多是Trigger直接嵌套Trigger的情况
  // 2. 触发children上直接被附加的事件
  triggerPropsEvent = (eventName: EventsByTriggerNeedType, e: any) => {
    const child: any = this.getChild()
    const childHandler = child && child.props && child.props[eventName]

    const props: any = this.getMergedProps()

    if (isFunction(childHandler)) {
      childHandler(e)
    }
    if (isFunction(props[eventName])) {
      props[eventName](e)
    }
  }

  onKeyDown = (e: any) => {
    const keyCode = e.keyCode || e.which
    this.triggerPropsEvent('onKeyDown', e)
    if (keyCode === Esc.code) {
      this.onPressEsc(e)
    }
  }

  onPressEsc = (e: any) => {
    const { escToClose } = this.getMergedProps()
    if (escToClose && e && e.key === Esc.key && this.state.popupVisible) {
      this.setPopupVisible(false)
    }
  }

  onMouseEnter = (e: any) => {
    const { mouseEnterDelay } = this.getMergedProps()
    this.triggerPropsEvent('onMouseEnter', e)
    this.clearDelayTimer()
    this.setPopupVisible(true, mouseEnterDelay || 0)
  }

  onMouseMove = (e: any) => {
    this.triggerPropsEvent('onMouseMove', e)
    this.setMouseLocation(e)
    if (this.state.popupVisible) {
      this.update()
    }
  }

  onMouseLeave = (e: any) => {
    const { mouseLeaveDelay } = this.getMergedProps()
    this.clearDelayTimer()
    this.triggerPropsEvent('onMouseLeave', e)

    if (this.isMouseLeaveToClose()) {
      if (this.state.popupVisible) {
        this.setPopupVisible(false, mouseLeaveDelay || 0)
      }
    }
  }

  onPopupMouseEnter = () => {
    this.clearDelayTimer()
  }

  onPopupMouseLeave = (e: any) => {
    this.onMouseLeave(e)
  }

  setMouseLocation = (e: any) => {
    if (this.getMergedProps().alignPoint) {
      this.mouseLocation = {
        clientX: e.clientX,
        clientY: e.clientY,
      }
    }
  }

  onContextMenu = (e: any) => {
    e.preventDefault()
    this.triggerPropsEvent('onContextMenu', e)
    this.setMouseLocation(e)

    if (!this.state.popupVisible) {
      this.setPopupVisible(true, 0)
    } else {
      // 更新位置
      this.getMergedProps().alignPoint && this.update()
    }
  }

  hideContextMenu = (e: any) => {
    const { popupVisible } = this.state
    if (popupVisible) {
      this.mousedownToHide = true
    }
    this.triggerPropsEvent('onClick', e)

    if (this.isClickToHide() && popupVisible) {
      this.setPopupVisible(!popupVisible, 0)
    }
  }

  onClick = (e: any) => {
    const { popupVisible } = this.state
    if (popupVisible) {
      this.mousedownToHide = true
    }
    this.triggerPropsEvent('onClick', e)
    this.setMouseLocation(e)

    if (!this.isClickToHide() && popupVisible) {
      return
    }

    this.setPopupVisible(!popupVisible, 0)
  }

  onFocus = (e: any) => {
    const { focusDelay } = this.getMergedProps()
    const onFocus = () => {
      this.triggerPropsEvent('onFocus', e)
    }

    this.clearDelayTimer()
    if (!this.mousedownToHide) {
      if (this.state.popupVisible) {
        onFocus && onFocus()
      } else {
        this.setPopupVisible(true, focusDelay || 0, onFocus)
      }
    }
    this.mousedownToHide = false
  }

  onBlur = (e: any) => {
    this.setPopupVisible(false, 200, () => this.triggerPropsEvent('onBlur', e))
  }

  onResize = () => {
    if (this.getMergedProps().autoFixPosition && this.state.popupVisible) {
      this.updatePopupPosition()
    }
  }

  onPopupMouseDown = () => {
    this.hasPopupMouseDown = true

    clearTimeout(this.mouseDownTimeout)
    this.mouseDownTimeout = setTimeout(() => {
      this.hasPopupMouseDown = false
    }, 0)
  }

  update = throttleByRaf(callback => {
    if (this.unmount || !this.state.popupVisible) {
      return
    }
    const popupStyle = this.getPopupStyle()

    this.setState(
      {
        popupStyle,
      },
      () => {
        callback && callback()
      }
    )
  })

  handleScroll = () => {
    const currentProps = this.getMergedProps()

    if (currentProps.containerScrollToClose) {
      this.setPopupVisible(false)
    } else if (currentProps.updateOnScroll) {
      this.handleUpdatePosition()
    }
  }

  setPopupVisible = (visible: boolean, delay = 0, callback?: () => void) => {}
}

export const EventsByTriggerNeed = [
  'onClick',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onFocus',
  'onBlur',
  'onContextMenu',
  'onKeyDown',
]

export type EventsByTriggerNeedType =
  | 'onClick'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onMouseMove'
  | 'onFocus'
  | 'onBlur'
  | 'onContextMenu'
  | 'onKeyDown'

export { TriggerProps }

export default Trigger
