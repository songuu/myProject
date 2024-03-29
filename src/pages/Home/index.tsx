import React, { useState } from 'react'

import {
  Skeleton,
  Spin,
  Tooltip,
  Button,
  Popconfirm,
  Message,
  Popover,
  Drawer,
  Breadcrumb,
} from '@components/index'

import { useTranslation } from 'react-i18next'

const BreadcrumbItem = Breadcrumb.Item

const routers = [
  {
    path: '/',
    breadcrumbName: '首页',
  },
  {
    path: '/#',
    breadcrumbName: '首页',
  },
  {
    path: '/#',
    breadcrumbName: '首页1',
  },
]

function Home() {
  const [visible, setVisible] = useState(false)

  const { t } = useTranslation()

  // return <Tooltip content="123123" trigger='hover' color="#1880ff"><button>点击一下</button></Tooltip>
  // return <Skeleton animation></Skeleton>
  // return <Button type="primary">点击一下</Button>
  /* return (
    <Popconfirm
      title="Are you sure you want to delete?"
      onOk={() => {
        Message.info({
          content: 'ok',
        })
      }}
      onCancel={() => {
        Message.error({
          content: 'cancel',
        })
      }}
    >
      <Button>Delete</Button>
    </Popconfirm>
  ) */
  /* return (
    <Popover
      popupVisible={true}
      title="123"
      content={
        <span>
          <p>Here is the text content</p>
          <p>Here is the text content</p>
        </span>
      }
    >
      312
    </Popover>
  ) */
  /* return (
    <>
      <Button
        onClick={() => {
          setVisible(true)
        }}
      >
        点击
      </Button>
      <Drawer
        width={332}
        title={<span>标题</span>}
        visible={visible}
        onOk={() => {
          setVisible(false)
        }}
        onCancel={() => {
          setVisible(false)
        }}
      >
        <div>Here is an example text.</div>

        <div>Here is an example text.</div>
      </Drawer>
    </>
  ) */
  return (
    <>
      <Breadcrumb routes={routers}>
        {/* <BreadcrumbItem>Home1</BreadcrumbItem>
      <BreadcrumbItem>Home2</BreadcrumbItem> */}
      </Breadcrumb>
    </>
  )
}

export default Home
