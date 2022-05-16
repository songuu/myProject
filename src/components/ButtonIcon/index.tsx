import React from 'react'

import styles from './index.module.less'

interface IProps {
  children: React.ReactNode
  onclick: () => void
}

const ButtonIcon: React.FC<IProps> = ({ children, onclick }) => {
  return (
    <button className={styles['button-icon']} onClick={onclick}>
      {children}
    </button>
  )
}

export default ButtonIcon
