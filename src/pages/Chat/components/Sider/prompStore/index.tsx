import React, { useState } from 'react'

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  ROLE,
} from 'baseui/modal'

import { Tabs, Tab } from 'baseui/tabs'

import { Input, SIZE } from 'baseui/input'

import { Card, StyledBody } from 'baseui/card'

import { Button, Icon } from '@components/index'

import DataTable from './data-source'

interface IProps {
  isOpen: boolean
  onClose: () => void
  onOk: () => void
}

const promptRecommendList: any = [
  {
    title: 'test',
    desc: 'test',
    downloadUrlL: 'ads',
  },
  {
    title: 'test',
    desc: 'test',
    downloadUrlL: 'ads',
  },
]

const PrompStore: React.FC<IProps> = ({ isOpen, onClose }) => {
  const [activeKey, setActiveKey] = useState<string | number>('local')

  const [searchValue, setSearchValue] = useState('')

  const [downloadURL, setDownloadURL] = useState('')

  const handleClose = () => {
    onClose()
  }
  return (
    <Modal
      onClose={handleClose}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      role={ROLE.dialog}
    >
      <ModalHeader>prompStore配置</ModalHeader>
      <ModalBody>
        <Tabs
          activeKey={activeKey}
          onChange={({ activeKey }) => {
            setActiveKey(activeKey)
          }}
        >
          <Tab key="local" title="本地">
            <div className="flex gap-3 mb-4 flex-row justify-between">
              <div className="flex items-center space-x-4">
                <Button type="primary" size="small">
                  添加
                </Button>
                <Button size="small">导入</Button>
                <Button size="small">导出</Button>
                <Button size="small">清除</Button>
              </div>
              <div className="flex items-center">
                <Input
                  autoFocus
                  value={searchValue}
                  size={SIZE.mini}
                  placeholder="请输入"
                  onChange={e => {
                    const value = e.target.value
                    setSearchValue(value)
                  }}
                />
              </div>
            </div>
            <DataTable />
          </Tab>
          <Tab key="online" title="在线">
            <p className="mb-4">请校验JSON文件</p>
            <div className="flex items-center gap-4">
              <Input
                autoFocus
                value={downloadURL}
                size={SIZE.mini}
                placeholder="请输入"
                onChange={e => {
                  const value = e.target.value
                  setDownloadURL(value)
                }}
              />
              <Button size="default" type="primary">
                下载
              </Button>
            </div>
            <div className="max-h-[360px] overflow-y-auto space-y-4 mt-2">
              {promptRecommendList.map(info => {
                return (
                  <Card title={info.title}>
                    <StyledBody>
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {info.desc}
                      </p>
                      <div className="flex items-center justify-end space-x-4">
                        <span className="text-xl hover:cursor-pointer">
                          <Icon
                            className="w-[20px] h-[20px] text-[#4f555e] dark:text-white"
                            type="icon-link"
                          />
                        </span>
                        <span className="text-xl hover:cursor-pointer">
                          <Icon
                            className="w-[20px] h-[20px] text-[#4f555e] dark:text-white"
                            type="icon-add"
                          />
                        </span>
                      </div>
                    </StyledBody>
                  </Card>
                )
              })}
            </div>
          </Tab>
        </Tabs>
      </ModalBody>
    </Modal>
  )
}

export default PrompStore
