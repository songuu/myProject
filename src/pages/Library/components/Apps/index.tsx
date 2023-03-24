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
            className="text-black relative transition-transform duration-200 cursor-pointer"
            key={app.name}
          >
            <div
              className="relative"
              onMouseOver={() => handleOver(app.name)}
              onMouseLeave={handleLeave}
            >
              <img
                src={app.cover}
                alt={app.name}
                className="w-full select-none rounded-xl dark:border-[1px] dark:border-solid dark:border-gray-800"
                style={{
                  // @ts-ignore
                  'aspect-ratio': '1/1',
                }}
              />
              {focusName === app.name && (
                <div className="absolute top-0 w-full h-[calc(100%_-_3px)] bg-transparent flex justify-center items-center">
                  <button
                    className="flex justify-center items-center bg-gray-500 dark:bg-gray-100 rounded-full w-[34%] h-[34%] cursor-pointer duration-200 hover:bg-gray-600 active:scale-95 backdrop-blur"
                    title="执行"
                    onClick={app.handler}
                  >
                    <Icon
                      type="icon-play"
                      className="h-[14px] dark:text-white"
                    />
                  </button>
                </div>
              )}
            </div>
            <div
              className="text-center mt-[8px] font-base font-semibold hover:underline hover:underline-offset-4 line-clamp-2 text-black dark:text-white"
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
