import React, { useMemo } from 'react'

import classnames from 'classnames'

// require('../../static/icons/search.svg')

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
      className={classnames('fill-current', iconClass)}
      aria-hidden="true"
      style={mystyle}
    >
      <use xlinkHref={myIconName} />
    </svg>
  )
}

export default SvgIcon
