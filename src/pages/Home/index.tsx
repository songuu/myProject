import React from 'react'

import {
  Skeleton,
  Spin,
  Tooltip,
  Button,
  Popconfirm,
  Message,
  Popover,
} from '@components/index'

function Home() {
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
  return (
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
  )
}

export default Home
