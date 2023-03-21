import React from 'react'

import classnames from 'classnames'

import styles from './index.module.less'

interface IProps {
  children: React.ReactNode
  onclick: () => void
  classname?: string
}

const ButtonIcon: React.FC<IProps> = ({
  children,
  onclick,
  classname = '',
}) => {
  return (
    <button
      className={classnames(styles['button-icon'], classname)}
      onClick={onclick}
    >
      {children}
    </button>
  )
}

export default ButtonIcon
