import React from 'react'

import { Typography } from '@arco-design/web-react'

const { Title } = Typography

import { useTranslation } from 'react-i18next'

import { AppStore, OssTypeMap } from '@mytypes/common'

import { hiddenTextFilter } from '@libs/utils'

import { Button } from '@components/index'

interface IProps {
  activeApp: AppStore
  onBucketDelete: (bucket: AppStore) => void
}

const ActiveBucket: React.FC<IProps> = ({ activeApp, onBucketDelete }) => {
  const { t } = useTranslation()

  const items = [
    {
      label: `${t('file.basic')}：`,
      children: [
        {
          label: `${t('file.cloudService')}：`,
          value: OssTypeMap[activeApp.type] || t('file.noConfiguration'),
        },
        {
          label: 'AK：',
          value: activeApp.ak || t('file.noConfiguration'),
        },
        {
          label: 'SK：',
          value: hiddenTextFilter(activeApp.sk || t('file.noConfiguration')),
        },
      ],
    },
    {
      label: `${t('file.software')}：`,
      children: [
        {
          label: `${t('file.defaultUploadPath')}：`,
          value: activeApp.uploadBucket || t('file.noConfiguration'),
        },
        {
          label: `${t('file.defaultUploadPrefix')}：`,
          value: activeApp.uploadPrefix || t('file.noConfiguration'),
        },
        {
          label: `${t('file.defaultDomainName')}：`,
          value: activeApp.defaultDomain || t('file.noConfiguration'),
        },
      ],
    },
  ]
  return (
    <div className="w-[calc(100%_-_180px)] overflow-y-auto overflow-x-hidden">
      <Title heading={2}>{t('file.profile')}</Title>
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
        <Title heading={2}>{t('file.operation')}</Title>
        <Button
          className="mt-[5px]"
          status="danger"
          onClick={() => onBucketDelete(activeApp)}
        >
          {t('delete')}
        </Button>
      </article>
    </div>
  )
}

export default ActiveBucket
