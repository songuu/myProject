import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Icon } from '@components/index'

type applyType = {
  name: string
  category: string[]
  cover: string
  local: string
  short: string
  handler: () => void
}
interface IProps {
  apps: applyType[]
}

const Apps: React.FC<IProps> = ({ apps }) => {
  const navigate = useNavigate()

  const [focusName, setFocusName] = useState<string>('')
  const handleOver = (name: string) => {
    setFocusName(name)
  }

  const handleLeave = () => {
    setFocusName('')
  }

  return apps.length ? (
    <div className="grid grid-cols-5 gap-x-[44px] gap-y-[24px]">
      {apps.map((app: applyType) => {
        return (
          <div
            className="relative cursor-pointer text-black transition-transform duration-200"
            key={app.name}
          >
            <div
              className="relative flex justify-center"
              onMouseOver={() => handleOver(app.name)}
              onMouseLeave={handleLeave}
            >
              <Icon
                type={app.cover}
                className="select-none rounded-xl text-7xl dark:border-[1px] dark:border-solid dark:border-gray-800"
                style={{
                  // @ts-ignore
                  aspectRatio: '1/1',
                }}
              />
              {focusName === app.name && (
                <div
                  className="absolute inset-x-1/2 inset-y-1/2 flex h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-400 backdrop-blur duration-200 hover:bg-gray-600 active:scale-95 dark:bg-gray-800"
                  title="执行"
                  onClick={app.handler}
                >
                  <Icon type="icon-play" className="text-lg dark:text-white" />
                </div>
              )}
            </div>
            <div
              className="font-base line-clamp-2 mt-[8px] text-center font-semibold text-black hover:underline hover:underline-offset-4 dark:text-white"
              onClick={() => navigate(app.short)}
            >
              {app.name}
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    <div></div>
  )
}

export default Apps
