import React from 'react'

import classnames from 'classnames'

import { AppStore } from '@mytypes/common'

import { Icon } from '@components/index'

interface IProps {
  apps: AppStore[]
  activeApp?: AppStore
  switchApp: (id?: string) => void
}

const BucketList: React.FC<IProps> = ({ apps, activeApp, switchApp }) => {
  const renderIcon = (type: Oss.OssType) => {
    switch (type) {
      case Oss.OssType.qiniu:
        return (
          <Icon type="icon-qiniu" className="h-[30px] w-[30px] text-[30px]" />
        )

      default:
        return null
    }
  }

  return (
    <ul className="h-[calc(100%_-_50px)] p-0 m-0 overflow-auto list-none">
      {apps.map((item: AppStore) => {
        return (
          <li
            className={classnames(
              'h-[40px] px-[18px] flex flex-row justify-between items-center',
              item._id === activeApp?._id && 'bg-gray-700 rounded-xl'
            )}
            key={item._id}
            onClick={() => {
              switchApp(item._id)
            }}
          >
            <div className="h-full w-full bg-none border-none outline-none text-left flex flex-row items-center text-white cursor-pointer">
              {renderIcon(item.type)}
              <span className="overflow-hidden text-ellipsis whitespace-nowrap  indent-3">
                {item.name}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default BucketList
