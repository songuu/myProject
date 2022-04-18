import React, { forwardRef, useState, useImperativeHandle } from 'react'

export interface MenuImperativeProps {
  /** 打开下拉 */
  openMenu: (e: React.MouseEvent<HTMLDivElement>) => void
  /** 关闭下拉 */
  closeMenu: () => void
}

const ContextMenu: React.FC = forwardRef(({}, ref) => {
  const [visible, setVisible] = useState<boolean>(false)

  const setMenu = (x: number, y: number) => {}

  useImperativeHandle<unknown, MenuImperativeProps>(ref, () => ({
    openMenu: (e: React.MouseEvent<HTMLDivElement>) => {
      setVisible(true)
    },
    closeMenu: () => {
      setVisible(false)
    },
  }))
  return <div>ContextMenu</div>
})

export default ContextMenu
