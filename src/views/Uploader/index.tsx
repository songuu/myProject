import React, { useEffect, useState } from 'react'

import { UploaderPage, Direction } from '@constants/enums'

import { getBgOffset } from '@utils/other'

import { AppStore } from '@mytypes/common'

import {
  SiderBar,
  TransferList,
  TransferDone,
  Bucket,
  Setting,
  Services,
} from './components'

import styles from './index.module.less'

function Uploader() {
  const getWidth = () => document.body.clientWidth - 225

  const [activePage, setActivePage] = useState<UploaderPage>(
    UploaderPage.bucket
  )

  const [direction, setDirection] = useState<Direction>(Direction.down)

  const [bgOffset, setBgOffset] = useState<string>(getBgOffset())

  const [mainWrapperWidth, setMainWrapperWidth] = useState<number>(getWidth())

  const [bucketLoading, setBucketLoading] = useState<boolean>(false)

  const [bucketList, setBucketList] = useState<string[]>([])

  const [activeBucket, setActiveBucket] = useState<string>('')

  const throttle = () => {
    let running = false
    return () => {
      if (running) return
      running = true
      requestAnimationFrame(() => {
        setMainWrapperWidth(getWidth())
        running = false
      })
    }
  }
  const throttleFn = throttle()

  useEffect(() => {
    setBgOffset(getBgOffset())
  }, [activePage])

  useEffect(() => {
    window.onresize = () => {
      setMainWrapperWidth(document.body.clientWidth - 225)
    }
    window.addEventListener('resize', throttleFn)

    return () => {
      window.removeEventListener('resize', throttleFn)
    }
  }, [])

  const renderPage = (page: UploaderPage) => {
    switch (page) {
      case UploaderPage.bucket:
        return <Bucket />
      case UploaderPage.services:
        return <Services onAppSwitch={onAppSwitch} />
      case UploaderPage.setting:
        return <Setting />
      case UploaderPage.transferDone:
        return <TransferDone />
      case UploaderPage.transferList:
        return <TransferList />
      default:
        return null
    }
  }

  const tabChange = async (page: UploaderPage, bucket: string) => {
    if (bucket && bucket !== activeBucket) {
      setActiveBucket(bucket)
    }
    setActivePage(page)
  }

  const onAppSwitch = async (app?: AppStore) => {
    try {
      console.log(app)
    } catch (err: unknown) {}
  }

  return (
    <div className={styles.main}>
      <div className={styles['drag-area']}></div>

      <SiderBar
        bucketLoading={bucketLoading}
        bucketList={bucketList}
        activeBucket={activeBucket}
        activePage={activePage}
        tabChange={tabChange}
      />

      <section
        className={styles['main-wrapper']}
        style={{
          backgroundPosition: bgOffset,
          width: mainWrapperWidth,
          maxWidth: mainWrapperWidth,
        }}
      >
        {renderPage(activePage)}
      </section>
    </div>
  )
}

export default Uploader
