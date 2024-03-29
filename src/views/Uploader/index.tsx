import React, { useEffect, useState } from 'react'

import { UploaderPage } from '@constants/enums'

import { getBgOffset } from '@utils/other'

import { AppStore, BucketMeta } from '@mytypes/common'

import audioSrc from '@static/audios/tip.mp3'

import { Message, Progress } from '@components/index'

import {
  SiderBar,
  TransferList,
  TransferDone,
  Bucket,
  Services,
} from './components'

const audio = new Audio(audioSrc)

function Uploader() {
  const getWidth = () => document.body.clientWidth - 225

  const [activePage, setActivePage] = useState<UploaderPage>(
    UploaderPage.bucket
  )

  const [bgOffset, setBgOffset] = useState<string>(getBgOffset())

  const [mainWrapperWidth, setMainWrapperWidth] = useState<number>(getWidth())

  const [bucketMeta, setBucketMeta] = useState<BucketMeta>(new BucketMeta())

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

  const playAudio = async () => {
    if (audio) {
      await audio.play()
    }
  }

  useEffect(() => {
    setBgOffset(getBgOffset())
  }, [activePage])

  useEffect(() => {
    initState().then(r => r)

    window.onresize = () => {
      setMainWrapperWidth(document.body.clientWidth - 225)
    }
    window.Main.on('transfer-finish', playAudio)
    window.addEventListener('resize', throttleFn)

    return () => {
      window.Main.on('transfer-finish', playAudio)
      window.removeEventListener('resize', throttleFn)
    }
  }, [])

  const initState = async () => {
    try {
      const app = await window.Main.initOss()

      setActiveApp(app)

      const buckets = (await window.Main.getBuckets()) || []

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
        return <Bucket bucketMeta={bucketMeta} />
      case UploaderPage.services:
        return <Services activeApp={activeApp} onAppSwitch={onAppSwitch} />
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
    } catch (err: any) {
      Message.info(err.message)
    } finally {
      setBucketLoading(false)
    }
  }

  const onAppSwitch = async (app?: AppStore) => {
    try {
      if (app) {
        const activeApp = await window.Main.initOss(app._id)

        setActiveApp(activeApp)

        const buckets = await window.Main.getBuckets()

        setBucketList(buckets)
      } else {
        setActiveApp(undefined)

        setBucketList([])
      }
    } catch (err: any) {
      Message.error(err.message)
      // console.log('切换 app 时出错')
    }
  }

  return (
    <div className="w-full h-full pl-[20px] pt-[20px] flex relative overflow-hidden">
      <SiderBar
        bucketLoading={bucketLoading}
        bucketList={bucketList}
        activeBucket={activeBucket}
        activePage={activePage}
        tabChange={tabChange}
      />

      <section
        className="overflow-auto w-full h-full box-border bg-no-repeat"
        style={{
          backgroundPosition: bgOffset,
          width: mainWrapperWidth,
          maxWidth: mainWrapperWidth,
          backgroundImage: `url(${require('@static/imgs/global.png')})`,
        }}
      >
        {renderPage(activePage)}
      </section>
    </div>
  )
}

export default Uploader
