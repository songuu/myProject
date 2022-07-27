import React, { PropsWithChildren, useState } from 'react'
import classnames from 'classnames'
// import Dropdown from '../Dropdown'
// import IconDown from '../../icon/react-icon/IconDown'
import omit from '@utils/omit'
import { BreadCrumbItemProps } from './interface'
import styles from './index.module.less'

function Item(props: PropsWithChildren<BreadCrumbItemProps>) {
  const { children, style, className, prefixCls, droplist, dropdownProps } =
    props
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const dom = (
    <div
      role="listitem"
      style={style}
      className={classnames(
        styles[`${prefixCls}-item`],
        {
          [styles[`${prefixCls}-item-with-dropdown`]]: droplist,
        },
        className
      )}
    >
      {children}
      {droplist && (
        <span
          aria-hidden
          className={classnames(styles[`${prefixCls}-item-dropdown-icon`], {
            [styles[`${prefixCls}-item-dropdown-icon-active`]]: dropdownVisible,
          })}
        >
          {/* <IconDown /> */}12
        </span>
      )}
    </div>
  )

  return dom

  /* return droplist ? (
    <Dropdown
      droplist={droplist}
      onVisibleChange={visible => {
        setDropdownVisible(visible)
        dropdownProps &&
          dropdownProps.onVisibleChange &&
          dropdownProps.onVisibleChange(visible)
      }}
      {...omit(dropdownProps, ['onVisibleChange'])}
    >
      {dom}
    </Dropdown>
  ) : (
    dom
  ) */
}

Item.displayName = 'BreadcrumbItem'

export default Item
