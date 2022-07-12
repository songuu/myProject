import React, { PureComponent, CSSProperties, PropsWithChildren } from 'react'

import { findDOMNode } from 'react-dom'

import ResizeObserverPolyfill from 'resize-observer-polyfill'

import mergeProps from '@utils/mergeProps'

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
  scrollElements!: HTMLElement[]

  // container 触发 resize时执行
  resizeObserver = new ResizeObserverPolyfill(() => {
    this.handleUpdatePosition()
  })

  childrenDom: any = null

  // 保存children节点的尺寸。 主要用于在弹出层动画前和动画完成后比较尺寸是否有变化。
  childrenDomSize: ReturnType<typeof getDOMPos> = {}

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
      // this.update()
    }

    const { popupVisible } = this.state

    this.popupOpen = !!popupVisible

    const { getDocument } = currentProps

    if (!popupVisible) {
      /* this.offClickOutside()
      this.offContainerResize()
      this.offWindowResize()
      this.offScrollListeners() */
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

  handleUpdatePosition = () => {}
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

export { TriggerProps }

export default Trigger
