import React, { useMemo } from 'react'

import { Button, Tooltip } from '@components/index'

import styles from './index.module.less'

const Sider = () => {
  const dd = () => {
    return (
      <div className={styles['list']}>
        <Button>word</Button>
        <Button>txt</Button>
      </div>
    )
  }
  return (
    <div className={styles['sider']}>
      <Button>添加对话</Button>
      <Tooltip content={dd} trigger="hover" color="#fff">
        <Button>导出数据</Button>
      </Tooltip>
    </div>
  )
}

export default Sider
