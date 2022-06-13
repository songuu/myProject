import React, { useEffect, useState, MouseEvent } from 'react'

import { FileDrop } from 'react-file-drop'

import VFolder from '@libs/vdir/VFolder'
import VFile from '@libs/vdir/VFile'
import { Item } from '@libs/vdir/types'

import { BucketMeta, Layout } from '@mytypes/common'

import BodyGrid from './BodyGrid'

import HeaderButtonGroup from './HeaderButtonGroup'

import HeaderToolbar from './HeaderToolbar'

import Footer from './Footer'

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
    displayBucketFiles(bucketMeta)
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

  const getOperationFiles = (opItem?: Item) => {
    if (opItem) {
      return _getFiles([opItem])
    }
  }

  const onFolderSelect = (name: string) => {
    vFolder.changeDir(name)
    setItems(vFolder.listFiles())
  }

  const onFolderContextMenu = (
    event: MouseEvent<HTMLElement>,
    item: VFolder
  ) => {}

  const onFileContextMenu = async (
    event: MouseEvent<HTMLElement>,
    item: VFile
  ) => {
    event.stopPropagation()

    await window.Main.showContextMenu({
      files: item,
      remoteDir: vFolder.getPathPrefix(),
    })
  }

  const onPanelContextMenu = () => {}

  const handleUpload = async (paths: string[]) => {
    try {
      await window.Main.uploadFiles({
        remoteDir: vFolder.getPathPrefix(),
        fileList: paths,
      })
    } catch (e: any) {
      console.error(e)
    }
  }

  const onPanelMouseDown = (event: MouseEvent<HTMLElement>) => {}

  const onRefreshBucket = async () => {
    setLoading(true)
    const resp = await window.Main.refreshBucket(true)

    displayBucketFiles({ ...resp, name: bucketMeta.name })
    setLoading(false)
  }

  const renderMainPanel = () => {
    if (!bucketMeta.name) {
      return <div>No bucket selected</div>
    }

    if (items.length <= 0) {
      return <div>No files in bucket</div>
    }

    return (
      <BodyGrid
        items={searchValue ? searchedItem : items}
        domains={domains}
        onFolderSelect={onFolderSelect}
        onFolderContextMenu={onFolderContextMenu}
        onFileSelect={() => {
          console.log()
        }}
        onFileContextMenu={onFileContextMenu}
        onPanelContextMenu={onPanelContextMenu}
        onPanelMouseDown={onPanelMouseDown}
      />
    )
  }

  const emptyFunction = () => {}

  useEffect(() => {
    window.Main.on('deleteFile', (remotePath: string) => {
      if (remotePath) {
        console.log('删除成功')
        onRefreshBucket()
      }
    })

    window.Main.on('uploadFileSuccess', () => {
      console.log('上传成功')
      onRefreshBucket()
    })

    return () => {
      window.Main.off('deleteFile', (remotePath: string) => {})
      window.Main.off('uploadFileSuccess', () => {})
    }
  }, [])

  return (
    <div className={styles['bucket-wrapper']}>
      <HeaderButtonGroup
        selectedItems={[]}
        fileUpload={emptyFunction}
        onDownload={emptyFunction}
        onDelete={emptyFunction}
      />

      <HeaderToolbar
        onRefreshBucket={onRefreshBucket}
        onSearchChange={emptyFunction}
        backspace={emptyFunction}
        layout={layout}
        onChangeLayout={emptyFunction}
        navigators={vFolder.getNav()}
      />

      <div className={styles['loading-wrapper']}>
        <FileDrop
          onDrop={async files => {
            if (files) {
              const filePaths: string[] = []
              for (let i = 0; i < files.length; i += 1) {
                filePaths.push(files[i].path)
              }

              await handleUpload(filePaths)
            }
          }}
        >
          <div className={styles['content-wrapper']}>{renderMainPanel()}</div>
        </FileDrop>
      </div>

      <Footer
        totalItem={vFolder.getTotalItem()}
        selectedItem={0}
        domains={domains}
      />
    </div>
  )
}

export default Bucket
