import React from 'react'
import { createFromIconfontCN } from '@ant-design/icons'

const AntdIcon = (props: any): JSX.Element => {
  const { className, type, ...otherParams } = props

  const Component = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_1888492_3pq7hs3y0rr.js',
  })

  return <Component className={className} type={type} {...otherParams} />
}

AntdIcon.defaultTypes = {
  type: '',
  className: '',
}

export default AntdIcon
