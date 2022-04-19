import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react'

import styles from './index.module.less'

export interface MenuImperativeProps {
  /** 打开下拉 */
  openMenu: (e: React.MouseEvent<HTMLDivElement>) => void
  /** 关闭下拉 */
  closeMenu: () => void
}

interface IPropsItem {
  children?: React.ReactNode,
  onclick?: () => void
}
interface IProps {
  ref: any
  children?: React.ReactNode
}

const ContextMenu: React.FC<IProps> = forwardRef((props, ref) => {
  const { children } = props

  const [visible, setVisible] = useState<boolean>(false)

  const [point, setPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const menuRef = useRef<HTMLDivElement>(null)

  const setMenu = (x: number, y: number) => {
    const largersHeight: number =
      window.innerHeight - (Number(menuRef.current?.offsetHeight) ?? 0) - 25

    const largeseWidth: number =
      window.innerWidth - (Number(menuRef.current?.offsetWidth) ?? 0) - 25

    if (y > largersHeight) y = largersHeight

    if (x > largeseWidth) x = largeseWidth

    setPoint({ x, y })
  }

  const closeMenu = () => {
    setVisible(false)
  }

  useImperativeHandle<unknown, MenuImperativeProps>(ref, () => ({
    openMenu: (e: React.MouseEvent<HTMLDivElement>) => {
      setVisible(true)

      setTimeout(() => {
        menuRef.current?.focus()

        setMenu(e.clientX, e.clientY)
      })

      e.preventDefault()
    },
    closeMenu: closeMenu,
  }))

  return (
    <div className={styles['context-menu']}>
      {visible && children && (
        <div
          ref={menuRef}
          className={styles['context-menu-content']}
          onBlur={closeMenu}
          onClick={closeMenu}
          style={{ top: point.y, left: point.x }}
          tabIndex={-1}
        >
          {children}
        </div>
      )}
    </div>
  )
})

const ContextItem: React.FC<IPropsItem> = ({ children, onclick }) => {
  return <div className={styles['menu-item']} onClick={onclick}>{children}</div>
}

export { ContextItem }

export default ContextMenu
