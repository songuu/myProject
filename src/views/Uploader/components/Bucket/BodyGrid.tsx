import React, { MouseEvent } from 'react'

import classnames from 'classnames'

import VFolder from '@libs/vdir/VFolder'
import VFile from '@libs/vdir/VFile'
import { Item } from '@libs/vdir/types'

import { supportedImage, getIconName } from '@libs/utils'

import { SvgIcon, WrapSelection } from '@components/index'

const mainGridCellCss = 'group w-[80px] h-[80px] overflow-hidden'

const mainGridCellInnerCss =
  'p-[5px] radius-[5px] flex items-center flex-col group-hover:bg-gray-100 dark:group-hover:bg-gray-200'

const iconCss = 'w-[50px] h-[50px] inline-block'

const nameCss =
  'inline-block w-full text-black text-center pt-[3px] overflow-hidden text-ellipsis whitespace-nowrap leading-5 text-sm dark:text-white group-hover:text-[#335EEA] dark:group-hover:text-black'

type PropTypes = {
  items: Item[]
  domains: string[]
  onFolderSelect: (name: string) => void
  onFolderContextMenu: (event: MouseEvent<HTMLElement>, item: VFolder) => void
  onFileSelect: () => void
  onFileContextMenu: (event: MouseEvent<HTMLElement>, item: VFile) => void
  onPanelContextMenu: () => void
  onPanelMouseDown: (event: MouseEvent<HTMLElement>) => void
  onSelect?: (ids: string[]) => void
  selections?: string[]
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
  const renderVFile = (item: VFile) => {
    return (
      <div
        className={classnames(
          mainGridCellCss,
          'main-grid__cell'
          /* selections.length &&
            selections.includes(String(item.shortId)) &&
            "bg-black border-1 border-solid border-gray-500" */
        )}
        key={item.name}
        onContextMenu={e => onFileContextMenu(e, item)}
        onDoubleClick={onFileSelect}
        data-id={item.shortId}
      >
        <div
          className={classnames(mainGridCellInnerCss, 'main-grid__cell-inner')}
          title={item.name}
        >
          {supportedImage(item.type) && domains.length > 0 ? (
            <div className="overflow-auto">
              <img
                className="w-[50px] h-[50px] object-cover"
                src={`http://${domains[0]}/${item.webkitRelativePath}`}
                alt={item.name}
              />
            </div>
          ) : (
            <SvgIcon iconName={getIconName(item.name)} iconClass={iconCss} />
          )}
          <span className={nameCss}>{item.name}</span>
        </div>
      </div>
    )
  }

  const renderVFolder = (item: VFolder) => {
    return (
      <div
        className={classnames(mainGridCellCss, 'main-grid__cell')}
        key={item.name}
        onContextMenu={e => onFolderContextMenu(e, item)}
        onDoubleClick={() => onFolderSelect(item.name)}
      >
        <div className={mainGridCellInnerCss} data-id={item.shortId}>
          <SvgIcon iconName="folder" iconClass={iconCss} />
          <span className={nameCss}>{item.name}</span>
        </div>
      </div>
    )
  }

  const renderItem = (item: Item) => {
    return item instanceof VFile ? renderVFile(item) : renderVFolder(item)
  }

  const onSelected = (fileIds: string[], item: any, isCtrlKey: any) => {
    // onSelect(fileIds)
  }

  return (
    // <WrapSelection onSelected={onSelected} selectables=".main-grid__cell">
    <div
      className={classnames(
        'w-full h-full px-[20px] py-[14px] grid gap-x-[5px] gap-y-[5px] ',
        'main-grid'
      )}
      style={{
        gridTemplateColumns: 'repeat(auto-fill, 80px)',
      }}
      onMouseDown={onPanelMouseDown}
      onContextMenu={onPanelContextMenu}
      role="presentation"
    >
      {items.map(renderItem)}
    </div>
    // </WrapSelection>
  )
}

export default BodyGrid
