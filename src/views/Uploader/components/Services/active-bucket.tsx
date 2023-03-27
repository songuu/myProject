import React from 'react'

import {
  HeadingXSmall,
  MonoDisplayXSmall,
  ParagraphSmall,
  MonoLabelMedium,
} from 'baseui/typography'

import { AppStore } from '@mytypes/common'

import { hiddenTextFilter } from '@libs/utils'

import { Button } from '@components/index'

const OssTypeMap: any = {
  [Oss.OssType.qiniu]: '七牛云',
}

interface IProps {
  activeApp: AppStore
  onBucketDelete: (bucket: AppStore) => void
}

const ActiveBucket: React.FC<IProps> = ({ activeApp, onBucketDelete }) => {
  const items = [
    {
      label: '基本信息：',
      children: [
        {
          label: '云服务厂商：',
          value: OssTypeMap[activeApp.type] || '暂无配置',
        },
        {
          label: 'AK：',
          value: activeApp.ak || '暂无配置',
        },
        {
          label: 'SK：',
          value: hiddenTextFilter(activeApp.sk || '暂无配置'),
        },
      ],
    },
    {
      label: '软件配置：',
      children: [
        {
          label: '默认上传路径：',
          value: activeApp.uploadBucket || '暂无配置',
        },
        {
          label: '默认上传前缀：',
          value: activeApp.uploadPrefix || '暂无配置',
        },
        {
          label: '默认域名：',
          value: activeApp.defaultDomain || '暂无配置',
        },
      ],
    },
  ]
  return (
    <div className="w-[calc(100%_-_180px)] overflow-hidden">
      <MonoDisplayXSmall>查看配置</MonoDisplayXSmall>
      {items.map((item, index) => {
        return (
          <article className="mt-5" key={index}>
            <HeadingXSmall className="mb-2">{item.label}</HeadingXSmall>
            {item.children.map((child, idx) => {
              return (
                <p className="flex mt-1" key={idx}>
                  <MonoLabelMedium>{child.label}</MonoLabelMedium>
                  <ParagraphSmall>{child.value}</ParagraphSmall>
                </p>
              )
            })}
          </article>
        )
      })}
      <article className="mt-5">
        <HeadingXSmall>操作</HeadingXSmall>
        <Button
          className="mt-[5px]"
          status="danger"
          onClick={() => onBucketDelete(activeApp)}
        >
          删除
        </Button>
      </article>
    </div>
  )
}

export default ActiveBucket
