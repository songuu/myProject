import React from 'react'

import { useTranslation } from 'react-i18next'

import { Button } from '@components/index'

import { BucketMeta } from '@mytypes/common'

interface PropTypes {
  fileUpload: () => void
  selectedItems: string[]
  onDownload: () => void
  onDelete: () => void
  bucketMeta?: BucketMeta
}

const HeaderButtonGroup: React.FC<PropTypes> = ({
  fileUpload,
  onDownload,
  onDelete,
  selectedItems,
  bucketMeta,
}) => {
  const { t } = useTranslation()
  return (
    <div className="border-b-solid box-border w-full border-b-[1px] border-b-[#f0f0f0] py-[8px] pr-[12px] leading-[56px]">
      <Button disabled={!bucketMeta} onClick={fileUpload}>
        {t('file.upload')}
      </Button>
      <Button
        disabled={selectedItems.length === 0}
        onClick={onDownload}
        className="ml-5"
      >
        {t('file.download')}
      </Button>
      <Button
        disabled={selectedItems.length === 0}
        onClick={onDelete}
        className="ml-5"
      >
        {t('file.delete')}
      </Button>
    </div>
  )
}

export default HeaderButtonGroup
