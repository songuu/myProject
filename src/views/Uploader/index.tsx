import React, { useEffect, useState } from 'react'

import { UploaderPage } from '@constants/enums'

import { getBgOffset } from '@utils/other'

import { AppStore, BucketMeta } from '@mytypes/common'

import {
  SiderBar,
  TransferList,
  TransferDone,
  Bucket,
  Setting,
  Services,
} from './components'

import styles from './index.module.less'

enum OssType {
  qiniu,
}

const OssTypeMap = {
  [OssType.qiniu]: '七牛云',
}

function Uploader() {
  const getWidth = () => document.body.clientWidth - 225

  const [activePage, setActivePage] = useState<UploaderPage>(
    UploaderPage.bucket
  )

  const [bgOffset, setBgOffset] = useState<string>(getBgOffset())

  const [mainWrapperWidth, setMainWrapperWidth] = useState<number>(getWidth())

  const [bucketMeta, setBucketMeta] = useState<BucketMeta>()

  const [bucketLoading, setBucketLoading] = useState<boolean>(false)

  const [bucketList, setBucketList] = useState<string[]>([])

  const [activeBucket, setActiveBucket] = useState<string>('')

  const [activeApp, setActiveApp] = useState<AppStore>()

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
    initState().then(r => r)

    window.onresize = () => {
      setMainWrapperWidth(document.body.clientWidth - 225)
    }
    window.addEventListener('resize', throttleFn)

    return () => {
      window.removeEventListener('resize', throttleFn)
    }
  }, [])

  const initState = async () => {
    try {
      const app = await window.Main.initApp()

      console.log(app)

      // setActiveApp(app)

      /* {
        type: OssType.qiniu,
        ak: 'JVjrJkUHRN7xLwWkJZBbg_CNbB2UBcdcN-td6wrU',
        sk: 'AcwhVLTA905CYqI-_-1ScWNBXulOJFYAE82ZL1-y',
      } */

      const buckets = await window.Main.getBuckets()

      setBucketList(buckets)

      if (buckets.length > 0) {
        await tabChange(UploaderPage.bucket, buckets[0])
      } else {
        setActivePage(UploaderPage.services)
      }
    } catch (err) {
      toService()
    }
  }

  const toService = () => {
    setActivePage(UploaderPage.services)
  }

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
    try {
      if (bucket && bucket !== activeBucket) {
        setBucketLoading(true)

        const resp = await window.Main.switchBucket(bucket)

        setActiveBucket(bucket)

        setBucketMeta({ ...resp, name: bucket })

        setBucketLoading(false)
      }
      setActivePage(page)
    } catch (err) {
    } finally {
      setBucketLoading(false)
    }
  }

  const onAppSwitch = async (app?: AppStore) => {
    try {
      //
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
