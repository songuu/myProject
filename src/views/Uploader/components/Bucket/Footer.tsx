import React from 'react'

type PropTypes = {
  totalItem: number
  selectedItem: number
  domains: string[]
}

const Footer = ({ totalItem, selectedItem, domains }: PropTypes) => {
  return (
    <div className="h-[40px] min-h-[40px] box-border px-[10px] flex flex-row justify-between items-center text-sm border-t-[1px] border-t-solid border-t-[#fafafa] dark:text-white">
      <div>
        <span>{`选中${selectedItem}项`}</span>
        <span>{`/总共${totalItem}项`}</span>
      </div>
      <span>{domains.length > 0 ? domains[0] : '没有绑定域名'}</span>
    </div>
  )
}

export default Footer
