import React from 'react'

import { Icon } from '@arco-design/web-react'

const IconFont = Icon.addFromIconFontCn({
  src: '//at.alicdn.com/t/c/font_1888492_2ud0hxdoj1h.js',
})

const ArcoIcon = (props: any): JSX.Element => {
  const { className, type, ...otherParams } = props

  return <IconFont className={className} src={type} {...otherParams} />
}

ArcoIcon.defaultTypes = {
  type: '',
  className: '',
}

export default ArcoIcon
