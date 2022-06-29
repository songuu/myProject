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
}) => {
  return (
    <div className={styles['buttons-wrapper']}>
      <button onClick={fileUpload}>上传文件</button>
      <button onClick={onDownload}>下载</button>
      <button onClick={onDelete}>删除</button>
    </div>
  )
}

export default HeaderButtonGroup
