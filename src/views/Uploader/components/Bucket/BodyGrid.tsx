import React, { MouseEvent } from 'react'

import VFolder from '@libs/vdir/VFolder'
import VFile from '@libs/vdir/VFile'
import { Item } from '@libs/vdir/types'

import { supportedImage } from '@libs/utils'

import styles from './index.module.less'

type PropTypes = {
  items: Item[]
  domains: string[]
  onFolderSelect: (name: string) => void
  onFolderContextMenu: (event: MouseEvent<HTMLElement>, item: VFolder) => void
  onFileSelect: () => void
  onFileContextMenu: (event: MouseEvent<HTMLElement>, item: VFile) => void
  onPanelContextMenu: () => void
  onPanelMouseDown: (event: MouseEvent<HTMLElement>) => void
}

const BodyGrid: React.FC<PropTypes> = ({
  items,
  domains,
  onFolderSelect,
  onFolderContextMenu,
  onFileSelect,
  onFileContextMenu,
  onPanelContextMenu,
  onPanelMouseDown,
}) => {
  const renderVFile = (item: VFile) => {
    return (
      <div
        className={styles['main-grid__cell']}
        key={item.name}
        onContextMenu={e => onFileContextMenu(e, item)}
        onDoubleClick={onFileSelect}
      >
        <div
          className={styles['main-grid__cell-inner']}
          data-row-key={item.shortId}
          title={item.name}
        >
          {supportedImage(item.type) && domains.length > 0 ? (
            <div className={styles['preview-image']}>
              <img
                src={`http://${domains[0]}/${item.webkitRelativePath}`}
                alt={item.name}
              />
            </div>
          ) : (
            234
          )}
          <span className={styles.name}>{item.name}</span>
        </div>
      </div>
    )
  }

  const renderVFolder = (item: VFolder) => {
    return (
      <div
        className={styles['main-grid__cell']}
        key={item.name}
        onContextMenu={e => onFolderContextMenu(e, item)}
        onDoubleClick={() => onFolderSelect(item.name)}
      >
        <div
          className={styles['main-grid__cell-inner']}
          data-row-key={item.shortId}
        >
          <span className={styles.name}>{item.name}</span>
        </div>
      </div>
    )
  }

  const renderItem = (item: Item) => {
    return item instanceof VFile ? renderVFile(item) : renderVFolder(item)
  }

  return (
    <div
      className={styles['main-grid']}
      onMouseDown={onPanelMouseDown}
      onContextMenu={onPanelContextMenu}
      role="presentation"
    >
      {items.map(renderItem)}
    </div>
  )
}

export default BodyGrid
