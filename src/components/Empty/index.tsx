import React, { forwardRef, memo } from 'react'

import classnames from 'classnames'

import Icon from '../Antd-Icon'

import { EmptyProps } from './interface'

function Empty(baseProps: EmptyProps, ref: React.Ref<any>) {
  const { style, className, description, icon, imgSrc, title, children } =
    baseProps

  const noData = '暂无数据'

  const alt = typeof description === 'string' ? description : 'empty'

  return (
    <div
      ref={ref}
      className={classnames('w-full py-[10px] box-border', className)}
      style={style}
    >
      <div className="w-full box-border text-center text-[#A9AEB8]">
        <div className="mb-[4px] leading-none text-[48px]">
          {imgSrc ? (
            <img alt={alt} src={imgSrc} />
          ) : (
            <Icon
              type="icon-empty"
              className="stroke-current fill-none inline-block text-current align-[-2px]"
            />
          )}
        </div>
        {title && <div className="text-lg text-[#6B7785]">{title}</div>}
        <div className="text-[#A9AEB8]">{description || noData}</div>
        {children ?? null}
      </div>
    </div>
  )
}

const EmptyComponent = forwardRef<unknown, EmptyProps>(Empty)

EmptyComponent.displayName = 'Empty'

export default memo(EmptyComponent)
