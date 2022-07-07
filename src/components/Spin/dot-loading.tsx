import React, { CSSProperties } from 'react'

import { isNumber } from '@utils/is'

export interface DotProps {
  size?: CSSProperties['fontSize']
}

const DotLoading: React.FC<DotProps> = props => {
  const prefixCls = `spin-dot`

  const dotStyle = {
    width: props.size,
    height: props.size,
  }

  const sizeNumber = props.size ? parseInt(String(props.size)) : 0

  return (
    <div
      className={`${prefixCls}-list`}
      style={{
        height: props.size,
        width: isNumber(sizeNumber) && sizeNumber > 0 ? sizeNumber * 7 : '',
      }}
    >
      {[...new Array(5)].map((_, index) => {
        return <div key={index} className={prefixCls} style={dotStyle} />
      })}
    </div>
  )
}

export default DotLoading
