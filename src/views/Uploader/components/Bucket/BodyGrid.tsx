import React, { MouseEvent } from 'react'

import classnames from 'classnames'

import VFolder from '@libs/vdir/VFolder'
import VFile from '@libs/vdir/VFile'
import { Item } from '@libs/vdir/types'

import { supportedImage, getIconName } from '@libs/utils'

import { SvgIcon, WrapSelection } from '@components/index'

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
  onSelect: (ids: string[]) => void
  selections: string[]
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
  onSelect,
  selections,
}) => {
  console.log(selections)

  const renderVFile = (item: VFile) => {
    return (
      <div
        className={classnames(
          styles['main-grid__cell'],
          selections.length &&
            selections.includes(String(item.shortId)) &&
            styles['selection']
        )}
        key={item.name}
        onContextMenu={e => onFileContextMenu(e, item)}
        onDoubleClick={onFileSelect}
        data-id={item.shortId}
      >
        <div
          className={classnames(
            styles['main-grid__cell-inner'],
            'main-grid__cell-inner'
          )}
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
            <SvgIcon
              iconName={getIconName(item.name)}
              iconClass={styles.icon}
            />
          )}
          <span className={styles.name}>{item.name}</span>
        </div>
      </div>
    )
  }

  const renderVFolder = (item: VFolder) => {
    return (
      <div
        className={classnames(styles['main-grid__cell'], 'main-grid__cell')}
        key={item.name}
        onContextMenu={e => onFolderContextMenu(e, item)}
        onDoubleClick={() => onFolderSelect(item.name)}
      >
        <div className={styles['main-grid__cell-inner']} data-id={item.shortId}>
          <SvgIcon iconName="folder" iconClass={styles.icon} />
          <span className={styles.name}>{item.name}</span>
        </div>
      </div>
    )
  }

  const renderItem = (item: Item) => {
    return item instanceof VFile ? renderVFile(item) : renderVFolder(item)
  }

  const onSelected = (fileIds: string[], item: any, isCtrlKey: any) => {
    onSelect(fileIds)
  }

  return (
    <WrapSelection onSelected={onSelected}>
      <div
        className={styles['main-grid']}
        onMouseDown={onPanelMouseDown}
        onContextMenu={onPanelContextMenu}
        role="presentation"
      >
        {items.map(renderItem)}
      </div>
    </WrapSelection>
  )
}

export default BodyGrid
