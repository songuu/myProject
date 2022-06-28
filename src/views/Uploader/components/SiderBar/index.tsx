import React, { useState } from 'react'

import classnames from 'classnames'

import { UploaderPage } from '@constants/enums'

import FileIcon from '@imgs/file.png'
import SettingIcon from '@imgs/setting.png'
import DoneIcon from '@imgs/done.png'
import DownloadIcon from '@imgs/download.png'
import AppsIcon from '@imgs/apps.png'

import styles from './index.module.less'

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

const SiderBar: React.FC<IProps> = ({
  activePage,
  activeBucket,
  tabChange,
  bucketList,
}) => {
  const [progress, setProgress] = useState<number>(0)
  const [showProgress, setShowProgress] = useState<boolean>(false)

  const activeTag = (page: UploaderPage, bucket: string) => {
    return (bucket && activePage === page && activeBucket === bucket) ||
      activePage === page
      ? styles['sidebar-container-sidebar-list-active']
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
    <div className={styles['the-sidebar-wrapper']}>
      <section className={styles['sidebar-container']}>
        <div className={styles['sidebar-container-title']}>
          <div className={styles['sidebar-container-title-text']}>储存空间</div>
        </div>
        <ul className={styles['sidebar-container-sidebar-list']}>
          {bucketList.length ? (
            bucketList.map((bucket: string) => (
              <div
                role="presentation"
                className={classnames(
                  styles['sidebar-container-sidebar-list-item'],
                  activeTag(UploaderPage.bucket, bucket)
                )}
                key={bucket}
                onClick={() => tabChange(UploaderPage.bucket, bucket)}
              >
                <img className="icon" src={FileIcon} alt="" />
                <div className="name" title={bucket}>
                  {bucket}
                </div>
              </div>
            ))
          ) : (
            <li
              className={classnames(
                styles['sidebar-container-sidebar-list-item'],
                styles['sidebar-container-sidebar-list-disabled']
              )}
            >
              <img className="icon" src={FileIcon} alt="" />
              <div className="name">暂无储存桶</div>
            </li>
          )}
        </ul>
      </section>
      <section className={styles['sidebar-container']}>
        <div className={styles['sidebar-container-title']}>
          <div className={styles['sidebar-container-title-text']}>传输列表</div>
          {showProgress && '进度条'}
        </div>
        <div className={styles['sidebar-container-sidebar-list']}>
          <div
            role="presentation"
            onClick={() => tabChange(UploaderPage.transferList, '')}
            className={classnames(
              styles['sidebar-container-sidebar-list-item'],
              activeTag(UploaderPage.transferList, '')
            )}
          >
            <img
              className={styles['sidebar-container-sidebar-list-item-icon']}
              src={DownloadIcon}
              alt=""
            />
            <div className={styles['sidebar-container-sidebar-list-item-name']}>
              传输列表
            </div>
          </div>
          <div
            role="presentation"
            onClick={() => tabChange(UploaderPage.transferDone, '')}
            className={classnames(
              styles['sidebar-container-sidebar-list-item'],
              activeTag(UploaderPage.transferDone, '')
            )}
          >
            <img
              className={styles['sidebar-container-sidebar-list-item-icon']}
              src={DoneIcon}
              alt=""
            />
            <div className={styles['sidebar-container-sidebar-list-item-name']}>
              传输完成
            </div>
          </div>
        </div>
      </section>
      <section className={styles['sidebar-container']}>
        <div className={styles['sidebar-container-title']}>
          <div className={styles['sidebar-container-title-text']}>设置</div>
        </div>
        <div className={styles['sidebar-container-sidebar-list']}>
          <div
            role="presentation"
            onClick={() => tabChange(UploaderPage.services, '')}
            className={classnames(
              styles['sidebar-container-sidebar-list-item'],
              activeTag(UploaderPage.services, '')
            )}
          >
            <img
              className={styles['sidebar-container-sidebar-list-item-icon']}
              src={AppsIcon}
              alt=""
            />
            <div className={styles['sidebar-container-sidebar-list-item-name']}>
              apps
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SiderBar
