import React from 'react'

import styles from './index.module.less'

interface PropTypes {
  fileUpload: () => void
  selectedItems: string[]
  onDownload: () => void
  onDelete: () => void
}

const HeaderButtonGroup: React.FC<PropTypes> = ({
  fileUpload,
  onDownload,
  onDelete,
  selectedItems,
}) => {
  return (
    <div className={styles['buttons-wrapper']}>
      <button onClick={fileUpload}>上传文件</button>
      <button disabled={selectedItems.length === 0} onClick={onDownload}>
        下载
      </button>
      <button disabled={selectedItems.length === 0} onClick={onDelete}>
        删除
      </button>
    </div>
  )
}

export default HeaderButtonGroup
