import React, { useState } from 'react'

import { Resizable } from 're-resizable'

import styles from './index.module.less'

const leftHandleStyle = {
  right: {
    width: '10px',
    right: '-9px',
  },
}

function Book() {
  const [leftWidth, setLeftWidth] = useState<number>(360)
  return (
    <div className={styles.table}>
      <div className={styles.contents}>
        <Resizable
          maxWidth={660}
          minWidth={360}
          handleStyles={leftHandleStyle}
          className={styles.table_left}
          enable={{ right: true }}
          size={{ width: leftWidth, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setLeftWidth(leftWidth + d.width)
          }}
        >
          <div className={styles.header}>
            <div className={styles.line}>
              <div className={styles.block}></div>
              <div className={styles.content}>
                <div className={styles.left}>变量数据+</div>
                <div className={styles.right}>共0条</div>
              </div>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.block}></div>
          </div>
        </Resizable>
        <Resizable
          maxWidth="40%"
          handleStyles={leftHandleStyle}
          className={styles.table_right}
          enable={{ right: true }}
        >
          <div className={styles.header}>
            <div className={styles.line}>
              <div className={styles.block}></div>
              <div className={styles.content}>
                <div className={styles.left}>变量数据+</div>
                <div className={styles.right}>共0条</div>
              </div>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.block}></div>
          </div>
        </Resizable>
      </div>

      <div className={styles.footer}>
        <div className={styles.block}>+</div>
      </div>
    </div>
  )
}

export default Book
