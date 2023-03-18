import React, { useEffect, useRef, useState } from 'react'

import { useLocation } from 'react-router-dom'

import { SvgIcon, Button, Input } from '@components/index'

const ChatContent = () => {
  const location = useLocation()

  const [dataSources, setDataSources] = useState<any>([])

  const [value, setValue] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)

  const handleClear = () => {}

  useEffect(() => {
    console.log('location', location)
  }, [location])

  return (
    <div className="flex flex-col w-full h-full">
      <main className="flex-1 overflow-hidden">
        <div
          id="scrollRef"
          ref={scrollRef}
          className="h-full overflow-hidden overflow-y-auto"
        >
          <div
            id="image-wrapper"
            className="w-full max-w-screen-xl m-auto dark:bg-[#101014] p-4"
          >
            {dataSources.length > 0 ? (
              <></>
            ) : (
              <div className="flex items-center justify-center mt-4 text-center text-neutral-300">
                <span>你好~</span>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="p-4">
        <div className="w-full max-w-screen-xl m-auto">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Button style={{ backgroundColor: '#fff' }} onClick={handleClear}>
                <span className="text-xl text-[#4f555e] dark:text-white">
                  <SvgIcon
                    mystyle={{ width: '20px', height: '20px' }}
                    iconName="delete"
                  />
                </span>
              </Button>
            </div>
            <div>
              <Button style={{ backgroundColor: '#fff' }} onClick={handleClear}>
                <span className="text-xl text-[#4f555e] dark:text-white">
                  <SvgIcon
                    mystyle={{ width: '20px', height: '20px' }}
                    iconName="download1"
                  />
                </span>
              </Button>
            </div>

            <div>
              <Button style={{ backgroundColor: '#fff' }} onClick={handleClear}>
                <span className="text-xl text-[#4f555e] dark:text-white">
                  <SvgIcon
                    mystyle={{ width: '20px', height: '20px' }}
                    iconName="note"
                  />
                </span>
              </Button>
            </div>

            <div className="n-auto-complete">
              <Input
                value={value}
                onChange={e => setValue(e)}
                placeholder="来说点什么吧"
              />
            </div>

            <Button type="primary" onClick={handleClear}>
              <span className="text-xl text-[#4f555e] dark:text-white">
                <SvgIcon
                  mystyle={{ width: '20px', height: '20px' }}
                  iconName="send"
                />
              </span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ChatContent
