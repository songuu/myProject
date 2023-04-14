import React from 'react'

import { useTranslation } from 'react-i18next'

type PropTypes = {
  totalItem: number
  selectedItem: number
  domains: string[]
}

const Footer = ({ totalItem, selectedItem, domains }: PropTypes) => {
  const { t } = useTranslation()
  return (
    <div className="border-t-solid box-border flex h-[40px] min-h-[40px] flex-row items-center justify-between border-t-[1px] border-t-[#fafafa] px-[10px] text-sm dark:text-white">
      <div>
        <span>{selectedItem}</span>
        <span>/{totalItem}</span>
      </div>
      <span>{domains.length > 0 ? domains[0] : t('file.noBoundDomain')}</span>
    </div>
  )
}

export default Footer
