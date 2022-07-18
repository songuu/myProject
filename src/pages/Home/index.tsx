import React from 'react'

import { Skeleton, Spin, Tooltip } from '@components/index'

function Home() {
  return <Tooltip content="123123" trigger='hover' color="#1880ff"><button>点击一下</button></Tooltip>
  // return <Skeleton animation></Skeleton>
}

export default Home
