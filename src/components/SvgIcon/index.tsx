import React, { useMemo } from 'react'

import classnames from 'classnames'

// require('../../static/icons/search.svg')

import styles from './index.module.less'

type Iprops = {
  iconClass?: string
  iconName: string
  mystyle?: React.CSSProperties
} & React.SVGAttributes<SVGElement>

const SvgIcon: React.FC<Iprops> = ({ iconName, iconClass, mystyle }) => {
  const myIconName = useMemo(() => {
    return `#${iconName}`
  }, [iconName])

  return (
    <svg
      className={classnames(styles['svg-icon'], iconClass)}
      aria-hidden="true"
    >
      <use xlinkHref={myIconName} />
    </svg>
  )
}

export default SvgIcon
