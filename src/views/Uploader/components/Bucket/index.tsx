import React, { useEffect, useState } from 'react'

import VFolder from '@libs/vdir/VFolder'
import VFile from '@libs/vdir/VFile'
import { Item } from '@libs/vdir/types'

import { BucketMeta, Layout } from '@mytypes/common'

import HeaderButtonGroup from './HeaderButtonGroup'

import HeaderToolbar from './HeaderToolbar'

import styles from './index.module.less'

type PropTypes = {
  bucketMeta: BucketMeta
}

const Bucket: React.FC<PropTypes> = ({ bucketMeta }) => {
  const [vFolder, setVFolder] = useState<VFolder>(new VFolder('root'))
  const [domains, setDomains] = useState<string[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [layout, setLayout] = useState<Layout>(Layout.grid)
  const [searchedItem, setSearchedItem] = useState<Item[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // displayBucketFiles(bucketMeta)
  }, [bucketMeta])

  const displayBucketFiles = (meta: BucketMeta) => {
    const vf = VFolder.from(meta.files)
    setVFolder(vf)
    setItems(vf.listFiles())
    setDomains(meta.domains)
  }

  const _getFiles = (itemArr: Item[]) => {
    let files: VFile[] = []
    itemArr.forEach(item => {
      if (item instanceof VFile) {
        files.push(item)
      } else {
        files = [...files, ..._getFiles([...item.getItems()])]
      }
    })
    return files
  }

  const onRefreshBucket = async () => {
    /* const resp = await refreshBucket(true)
    displayBucketFiles({ ...resp, name: bucketMeta.name })
    setLoading(false) */
  }

  const renderMainPanel = () => {
    if (!bucketMeta.name) {
      return <div>No bucket selected</div>
    }

    if (items.length <= 0) {
      return <div>No files in bucket</div>
    }

    return <>123</>
  }

  const emptyFunction = () => {}

  return (
    <div className={styles['bucket-wrapper']}>
      <HeaderButtonGroup
        selectedItems={[]}
        fileUpload={emptyFunction}
        onDownload={emptyFunction}
        onDelete={emptyFunction}
      />

      <HeaderToolbar
        onRefreshBucket={emptyFunction}
        onSearchChange={emptyFunction}
        backspace={emptyFunction}
        layout={layout}
        onChangeLayout={emptyFunction}
        navigators={vFolder.getNav()}
      />
    </div>
  )
}

export default Bucket
