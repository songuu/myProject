import React, { useState } from 'react'

import classnames from 'classnames'

import { HeadingMedium, HeadingSmall } from 'baseui/typography'

import { UploaderPage } from '@constants/enums'

import { Icon } from '@components/index'

interface IProps {
  bucketList: string[]
  bucketLoading: boolean
  activeBucket: string
  activePage: UploaderPage
  tabChange: (page: UploaderPage, bucket: string) => void
}

type ProgressItem = {
  id: string
  progress: number
}

const listItemCss =
  'h-[36px] flex items-center px-[8px] my-[6px] mr-[8px] cursor-pointer text-[#7a7a7b] hover:text-[#335EEA] flex-row text-lg'

const listItemIconCss = 'inline-block w-[14px] h-[14px] text-[14px]'

const SiderBar: React.FC<IProps> = ({
  activePage,
  activeBucket,
  tabChange,
  bucketList,
}) => {
  const [progress, setProgress] = useState<number>(0)
  const [showProgress, setShowProgress] = useState<boolean>(false)

  const activeTag = (page: UploaderPage, bucket: string) => {
    return bucket
      ? activePage === page && activeBucket === bucket
        ? 'bg-[#eaeffd] rounded-xl text-[#335EEA]'
        : ''
      : activePage === page
      ? 'bg-[#eaeffd] rounded-xl text-[#335EEA]'
      : ''
  }

  const onProgress = (e: any, progressList: ProgressItem[]) => {
    setShowProgress(true)
    const total = progressList.reduce((pre, cur) => pre + cur.progress, 0)
    setProgress(total / progressList.length)
  }

  const onFinish = () => {
    setProgress(100)
    setTimeout(() => setShowProgress(false), 200)
  }

  return (
    <div className="w-[225px] overflow-auto">
      <section className="mb-[30px]">
        <HeadingMedium>储存空间</HeadingMedium>
        <ul className="p-0 m-0">
          {bucketList.length ? (
            bucketList.map((bucket: string) => (
              <div
                role="presentation"
                className={classnames(
                  listItemCss,
                  activeTag(UploaderPage.bucket, bucket)
                )}
                key={bucket}
                onClick={() => tabChange(UploaderPage.bucket, bucket)}
              >
                <Icon type="icon-folder" />
                <div className="ml-2 text-sm" title={bucket}>
                  {bucket}
                </div>
              </div>
            ))
          ) : (
            <li
              className={classnames(
                listItemCss,
                'opacity-30 cursor-not-allowed'
              )}
            >
              <Icon type="icon-folder" />
              <div className="name ml-2 text-sm">暂无储存桶</div>
            </li>
          )}
        </ul>
      </section>
      <section className="mb-[30px]">
        <HeadingSmall>传输列表{showProgress && '进度条'}</HeadingSmall>
        <div className="p-0 m-0">
          <div
            role="presentation"
            onClick={() => tabChange(UploaderPage.transferList, '')}
            className={classnames(
              listItemCss,
              activeTag(UploaderPage.transferList, '')
            )}
          >
            <Icon type="icon-download" className={listItemIconCss} />
            <div className="pl-[10px] text-sm">传输列表</div>
          </div>
          <div
            role="presentation"
            onClick={() => tabChange(UploaderPage.transferDone, '')}
            className={classnames(
              listItemCss,
              activeTag(UploaderPage.transferDone, '')
            )}
          >
            <Icon type="icon-done" className={listItemIconCss} />
            <div className="pl-[10px] text-sm">传输完成</div>
          </div>
        </div>
      </section>
      <section className="mb-[30px]">
        <HeadingSmall>设置</HeadingSmall>
        <div className="p-0 m-0">
          <div
            role="presentation"
            onClick={() => tabChange(UploaderPage.services, '')}
            className={classnames(
              listItemCss,
              activeTag(UploaderPage.services, '')
            )}
          >
            <Icon type="icon-app" className={listItemIconCss} />
            <div className="pl-[10px] text-sm">apps</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SiderBar
