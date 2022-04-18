import React, { useMemo } from 'react'

import searchIcon from '@icons/search.svg'

import styles from './index.module.less'

interface Iprops {
  iconClass?: string
  iconName: string
}

const icons: { [K in string]: any } = { search: searchIcon }

const SvgIcon: React.FC<Iprops> = ({ iconName, iconClass }) => {
  const myIconName = useMemo(() => {
    return icons[iconName]
  }, [iconClass])

  console.log(myIconName)

  return (
    <svg className={styles['svg-icon']} aria-hidden="true">
      <use xlinkHref={myIconName} />
    </svg>
  )
}

export default SvgIcon
