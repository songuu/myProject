import React, { PureComponent } from 'react'

import { selectAll } from './selectAll'

import WrapSelectionClass from './style.module.less'

export default class WrapSelection extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isMouseDown: false,
      isSingleClick: true,
      selectEle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        display: 'none',
      },
      selectedItems: [],
      selectedPostions: [],
      _selectables: [],
    }
  }

  getTop(e) {
    var offset = e.offsetTop
    if (e.offsetParent != null) offset += this.getTop(e.offsetParent)
    return offset
  }

  getLeft(e) {
    var offset = e.offsetLeft
    if (e.offsetParent != null) offset += this.getLeft(e.offsetParent)
    return offset
  }

  scroll() {
    if (window.pageYOffset) {
      return {
        scrollLeft: window.pageXOffset,
        scrollTop: window.pageYOffset,
      }
    } else if (document.compatMode === 'CSS1Compat') {
      return {
        scrollLeft: document.documentElement.scrollLeft,
        scrollTop: document.documentElement.scrollTop,
      }
    }

    return {
      scrollLeft: document.body.scrollLeft,
      scrollTop: document.body.scrollTop,
    }
  }

  isInPath(target, wrapper) {
    const iOffLeft = target.offsetLeft
    const iOffTop = target.offsetTop
    const iLeft = target.offsetWidth + iOffLeft
    const iTop = target.offsetHeight + iOffTop

    if (
      iLeft > wrapper.left &&
      iTop > wrapper.top &&
      iOffLeft < wrapper.left + wrapper.width &&
      iOffTop < wrapper.top + wrapper.height
    ) {
      return true
    }
    return false
  }

  mouseDown(e) {
    if (e.button === 2) {
      return
    }

    const { selectEle } = this.state

    const { clientX, clientY } = e

    const top = this.getTop(e.currentTarget)
    const left = this.getLeft(e.currentTarget)
    const { scrollTop, scrollLeft } = this.scroll()

    const startX = clientX - left + scrollLeft
    const startY = clientY - top + scrollTop

    selectEle.left = startX
    selectEle.top = startY

    /*
     *
     * 首先判断是不是选中文件小框的元素
     * 再判断是不是按住了ctrl按钮
     */

    this.setState({
      isMouseDown: true,
      isSingleClick: true,
      startX,
      startY,
      selectEle,
    })
  }

  mouseMove(e) {
    e.preventDefault()
    e.stopPropagation()

    const {
      isMouseDown,
      isSingleClick,
      selectEle,
      startX,
      startY,
      selectedItems,
      selectedPostions,
    } = this.state

    if (!isMouseDown || isSingleClick) return

    const top = this.getTop(e.currentTarget)
    const left = this.getLeft(e.currentTarget)
    const { scrollTop, scrollLeft } = this.scroll()

    const { clientX, clientY } = e

    const _x = clientX - left + scrollLeft
    const _y = clientY - top + scrollTop

    selectEle.left = _x > startX ? startX - 1 : _x + 1
    selectEle.top = _y > startY ? startY - 1 : _y + 1
    selectEle.width = Math.abs(_x - startX)
    selectEle.height = Math.abs(_y - startY)
    selectEle.display = 'block'

    const items = [
      ...e.currentTarget.getElementsByClassName('cNQfoHLCH8281L1l0g3W'),
    ]

    selectedItems.length = 0
    selectedPostions.length = 0

    items.forEach(item => {
      // this.removeActiveClass(item);

      if (this.isInPath(item, selectEle)) {
        // this.addActiveClass(item);
        selectedItems.push(item)
        selectedPostions.push(item.dataset['id'])
      }
    })

    this.setState({
      selectEle,
      isSingleClick: false,
      selectedItems,
      selectedPostions,
    })
  }

  async mouseUp(e) {
    e.preventDefault()
    e.stopPropagation()

    const { selectEle, selectedItems, selectedPostions, isSingleClick } =
      this.state

    const { onSelected } = this.props

    if (isSingleClick) {
      await this.resolveSelectables()

      // * 需要取绝对的位置
      const x = this.getLeft(e.target)
      const y = this.getTop(e.target)

      const target = this.state._selectables.find(item => {
        const { left, top, right, bottom } = item.getBoundingClientRect()

        return x < right && x > left && y < bottom && y > top
      })

      if (target) {
        onSelected([target.dataset['id']], [])

        this.setState({
          isMouseDown: false,
          isSingleClick: true,
        })

        return
      }
    }

    selectEle.left = 0
    selectEle.top = 0
    selectEle.width = 0
    selectEle.height = 0
    selectEle.display = 'none'

    onSelected && onSelected(selectedPostions, selectedItems, e.ctrlKey)

    this.setState({
      isMouseDown: false,
      selectEle,
      selectedPostions: [],
    })
  }

  // 手动清除之前的状态
  clearSelection() {
    this.setState({
      selectedItems: [],
      selectedPostions: [],
      isMouseDown: false,
      isSingleClick: true,
    })
  }

  // 获取所有的显示的元素
  resolveSelectables() {
    const _selectables = selectAll(this.props.selectables)

    this.setState({ _selectables })
  }

  render() {
    return (
      <div
        className={WrapSelectionClass.container}
        onMouseDown={e => this.mouseDown(e)}
        onMouseMove={e => this.mouseMove(e)}
        onMouseUp={e => this.mouseUp(e)}
      >
        <div
          className={WrapSelectionClass.selectionElement}
          style={{ ...this.state.selectEle }}
        />
        {this.props.children}
      </div>
    )
  }
}
