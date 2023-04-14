import React, { useEffect, useState, MouseEvent } from 'react'

import { FileDrop } from 'react-file-drop'

import { useTranslation } from 'react-i18next'

import VFolder from '@libs/vdir/VFolder'
import VFile from '@libs/vdir/VFile'
import { Item } from '@libs/vdir/types'

import { BucketMeta, Layout } from '@mytypes/common'

import { Empty, Message } from '@components/index'

import useSelection from '@hooks/useSelection'

import BodyGrid from './BodyGrid'

import HeaderButtonGroup from './HeaderButtonGroup'

import HeaderToolbar from './HeaderToolbar'

import Footer from './Footer'

type PropTypes = {
  bucketMeta: BucketMeta
}

const Bucket: React.FC<PropTypes> = ({ bucketMeta }) => {
  const { t } = useTranslation()
  const [vFolder, setVFolder] = useState<VFolder>(new VFolder('root'))
  const [domains, setDomains] = useState<string[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [layout, setLayout] = useState<Layout>(Layout.grid)
  const [searchedItem, setSearchedItem] = useState<Item[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  // const [selection, setSelection] = useState<string[]>([])
  const selection = useSelection(items)

  useEffect(() => {
    displayBucketFiles(bucketMeta)
  }, [bucketMeta])

  const backspace = () => {
    selection.clear()
    vFolder.back()
    setItems(vFolder.listFiles())
  }

  const displayBucketFiles = (meta: BucketMeta) => {
    const vf = VFolder.from(meta.files)
    setVFolder(vf)
    setItems(vf.listFiles())
    setDomains(meta.domains)
  }

  const getOperationFiles = (opItem?: Item) => {
    // 开始获取选中文件数量
    let files: VFile[] = []

    if (selection.fileIds.length > 0) {
      // 如果选中区域有文件的话，那么下载选中区域的文件
      const itemsArr: Item[] = []
      selection.fileIds.forEach(fileId => {
        const item = vFolder.getItem(fileId)
        if (item) itemsArr.push(item)
      })
      files = _getFiles(itemsArr)
    }

    if (files.length <= 0 && opItem) {
      // 如果选中区域没有文件，那么直接下载当前上下文中的区域
      files = _getFiles([opItem])
    }

    return files
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
      titles: [t('file.copyLink'), t('common.download'), t('common.delete')],
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

  const handleDownload = async () => {
    try {
      const files = getOperationFiles()

      await window.Main.downloadFiles({
        remoteDir: vFolder.getPathPrefix(),
        fileList: files,
      })
    } catch (e: any) {
      Message.error(`${t('common.failed')}：${e.message}`)
    }
  }

  const handleDelete = async () => {
    const files = getOperationFiles()

    await window.Main.deleteFiles({ fileList: [...files] })

    await onRefreshBucket()
  }

  const onPanelMouseDown = (event: MouseEvent<HTMLElement>) => {
    if (!event.ctrlKey && !event.metaKey && event.button !== 2) {
      selection.clear()
    }
  }

  const onRefreshBucket = async () => {
    setLoading(true)
    selection.clear()
    const resp = await window.Main.refreshBucket(true)

    displayBucketFiles({ ...resp, name: bucketMeta.name })
    setLoading(false)
  }

  const renderMainPanel = () => {
    if (!bucketMeta.name) {
      return (
        <Empty
          title={`${t('file.none')}Bucket`}
          description={t('file.noBucketCurrentlySelected')}
        />
      )
    }

    if (items.length <= 0) {
      return (
        <Empty
          title={`${t('file.none')}${t('file.file')}`}
          description={t('file.noFilesInTheCurrentBucket')}
        />
      )
    }

    return (
      <BodyGrid
        items={searchValue ? searchedItem : items}
        domains={domains}
        onFolderSelect={onFolderSelect}
        onFolderContextMenu={onFolderContextMenu}
        onFileSelect={(file: VFile) => {
          if (file) {
            const pp = `http://${domains[0]}/${file.webkitRelativePath}`
            // console.log('file', file)
            window.Main.openExternal(pp)
          }
        }}
        onFileContextMenu={onFileContextMenu}
        onPanelContextMenu={onPanelContextMenu}
        onPanelMouseDown={onPanelMouseDown}
        onSelect={(ids: string[]) => {
          // setSelection(ids)
        }}
        // selections={selection}
      />
    )
  }

  const emptyFunction = () => {}

  useEffect(() => {
    window.Main.on('deleteFile', (remotePath: string) => {
      if (remotePath) {
        Message.success(t('common.deleteSuccess'))
        onRefreshBucket()
      }
    })

    window.Main.on('uploadFileSuccess', () => {
      Message.success(t('common.importSuccess'))
      onRefreshBucket()
    })

    window.Main.on('downloadFile', (downloadPath: string) => {
      if (downloadPath) {
        Message.success(t('common.exportSuccess'))
      }
    })

    return () => {
      window.Main.off('deleteFile', (remotePath: string) => {})
      window.Main.off('uploadFileSuccess', () => {})
      window.Main.off('downloadFile', (downloadPath: string) => {})
    }
  }, [])

  return (
    <div
      className="flex h-full select-none flex-col"
      style={{
        // @ts-ignore
        WebkitAppRegion: 'no-drag',
      }}
    >
      <HeaderButtonGroup
        selectedItems={selection.fileIds}
        fileUpload={() => {
          inputRef.current?.click()
        }}
        onDownload={handleDownload}
        onDelete={handleDelete}
        bucketMeta={bucketMeta}
      />

      <HeaderToolbar
        onRefreshBucket={onRefreshBucket}
        onSearchChange={emptyFunction}
        backspace={backspace}
        layout={layout}
        onChangeLayout={emptyFunction}
        navigators={vFolder.getNav()}
      />

      <div className="relative box-border h-full overflow-hidden">
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
          className="h-full"
        >
          <div className="z-50 h-full overflow-y-auto overflow-x-hidden">
            {renderMainPanel()}
          </div>
        </FileDrop>
      </div>

      <Footer
        totalItem={vFolder.getTotalItem()}
        selectedItem={selection.fileIds.length}
        domains={domains}
      />

      <input
        onChange={e => {
          const files: any = e.target.files

          if (files && files.length > 0) {
            const filePaths: string[] = [...files].map(
              (file: File) => file.path
            )
            handleUpload(filePaths)
          }
          // this.batchProcessFile(e.target.files[0]);
          e.target.value = ''
        }}
        ref={inputRef}
        style={{
          display: 'none',
        }}
        multiple={true}
        type="file"
        accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
      />
    </div>
  )
}

export default Bucket
