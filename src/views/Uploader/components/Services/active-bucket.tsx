import React from 'react'

import { Typography } from '@arco-design/web-react'

const { Title } = Typography

import { AppStore, OssTypeMap } from '@mytypes/common'

import { hiddenTextFilter } from '@libs/utils'

import { Button } from '@components/index'

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
      <Title heading={2}>查看配置</Title>
      {items.map((item, index) => {
        return (
          <article className="mt-5" key={index}>
            <Title heading={4} className="mb-2">
              {item.label}
            </Title>
            {item.children.map((child, idx) => {
              return (
                <p className="mt-1 flex" key={idx}>
                  <Title heading={6}>{child.label}</Title>
                  <Title heading={6}>{child.value}</Title>
                </p>
              )
            })}
          </article>
        )
      })}
      <article className="mt-5">
        <Title heading={2}>操作</Title>
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
