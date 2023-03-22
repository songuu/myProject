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
      className={classnames(
        'rounded-xl flex items-center justify-start m-[4px] p-[8px] bg-transparent first:ml-0 hover:bg-gray-200 active:scale-92',
        classname
      )}
      onClick={onclick}
    >
      {children}
    </button>
  )
}

export default ButtonIcon
