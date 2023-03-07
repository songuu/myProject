import React from 'react'

import { Button, Tooltip } from '@components/index'

import { TxtExporter, WordExporter } from '@root/components/Exporter'

import styles from './index.module.less'

const Sider = () => {
  const dd = () => {
    return (
      <div className={styles['list']}>
        <TxtExporter data={[]} />
        <WordExporter data={[]} />
      </div>
    )
  }
  return (
    <div className={styles['sider']}>
      <Button>添加对话</Button>
      <Tooltip content={dd} trigger="click" color="#fff">
        <Button>导出数据</Button>
      </Tooltip>
    </div>
  )
}

export default Sider
