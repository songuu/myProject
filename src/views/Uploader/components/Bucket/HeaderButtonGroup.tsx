import React from 'react'

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
  return (
    <div className="box-border pr-[12px] py-[8px] w-full leading-[56px] border-b-[1px] border-b-[#f0f0f0] border-b-solid">
      <Button disabled={!bucketMeta} onClick={fileUpload}>
        上传文件
      </Button>
      <Button
        disabled={selectedItems.length === 0}
        onClick={onDownload}
        className="ml-5"
      >
        下载
      </Button>
      <Button
        disabled={selectedItems.length === 0}
        onClick={onDelete}
        className="ml-5"
      >
        删除
      </Button>
    </div>
  )
}

export default HeaderButtonGroup
