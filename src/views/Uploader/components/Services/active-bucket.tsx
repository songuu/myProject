import React from 'react'

import { HeadingXSmall } from 'baseui/typography'

import { AppStore } from '@mytypes/common'

import { hiddenTextFilter } from '@libs/utils'

import { Button } from '@components/index'

enum OssType {
  qiniu,
}

const OssTypeMap: any = {
  [OssType.qiniu]: '七牛云',
}

import styles from './index.module.less'

interface IProps {
  activeApp: AppStore
  onBucketDelete: (bucket: AppStore) => void
}

const ActiveBucket: React.FC<IProps> = ({ activeApp, onBucketDelete }) => {
  return (
    <div className="w-[calc(100%_-_180px)] overflow-hidden">
      <HeadingXSmall>查看配置</HeadingXSmall>
      <section className={styles['app-description']}>
        <article className={styles['app-description-section']}>
          <h1 className={styles['app-description-section_title']}>
            基本信息：
          </h1>
          <p className={styles['app-description-section_item']}>
            <span className={styles['app-description-section_item__title']}>
              云服务厂商：
            </span>
            <span className={styles['app-description-section_item__content']}>
              {OssTypeMap[activeApp.type] || '暂无配置'}
            </span>
          </p>
          <p className={styles['app-description-section_item']}>
            <span className={styles['app-description-section_item__title']}>
              AK：
            </span>
            <span className={styles['app-description-section_item__content']}>
              {activeApp.ak || '暂无配置'}
            </span>
          </p>
          <p className={styles['app-description-section_item']}>
            <span className={styles['app-description-section_item__title']}>
              SK：
            </span>
            <span className={styles['app-description-section_item__content']}>
              {hiddenTextFilter(activeApp.sk || '暂无配置')}
            </span>
          </p>
        </article>
        <article className={styles['app-description-section']}>
          <h1 className={styles['app-description-section_title']}>
            软件配置：
          </h1>
          <p className={styles['app-description-section_item']}>
            <span className={styles['app-description-section_item__title']}>
              默认上传路径：
            </span>
            <span className={styles['app-description-section_item__content']}>
              {activeApp.uploadBucket || '暂无配置'}
            </span>
          </p>
          <p className={styles['app-description-section_item']}>
            <span className={styles['app-description-section_item__title']}>
              默认上传前缀：
            </span>
            <span className={styles['app-description-section_item__content']}>
              {activeApp.uploadPrefix || '暂无配置'}
            </span>
          </p>
          <p className={styles['app-description-section_item']}>
            <span className={styles['app-description-section_item__title']}>
              默认域名：
            </span>
            <span className={styles['app-description-section_item__content']}>
              {activeApp.defaultDomain || '暂无配置'}
            </span>
          </p>
        </article>
        <article className={styles['app-description-section']}>
          <h1 className={styles['app-description-section_title']}>操作</h1>
          <Button
            className="ml-[5px]"
            status="danger"
            onClick={() => onBucketDelete(activeApp)}
          >
            删除
          </Button>
        </article>
      </section>
    </div>
  )
}

export default ActiveBucket
