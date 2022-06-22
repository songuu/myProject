import React, { useState, useEffect } from 'react'

import classnames from 'classnames'

import { fileSizeFormatter } from '@libs/utils'

import styles from './index.module.less'

enum TaskType {
  download,
  upload,
}

enum TransferStatus {
  default,
  done,
  failed,
}

type TransferStore = {
  id: string
  name: string
  size: number
  date: number
  type: TaskType
  status: TransferStatus
}

type ProgressListType = {
  id: string
  progress: number
}

interface TransferStoreWithProgress extends TransferStore {
  progress: number
}

function TransferList() {
  const [transfers, setTransfers] = useState<TransferStoreWithProgress[]>([])

  const initState = async () => {
    const transferList = await window.Main.getTransfers({
      status: TransferStatus.default,
    })

    console.log(transferList)

    const transfer = transferList.map((item: TransferStore) => ({
      ...item,
      progress: 0,
    }))

    setTransfers(transfer)
  }

  const typeFormatter = (type: TaskType) => {
    switch (type) {
      case TaskType.download:
        return '下载'
      case TaskType.upload:
        return '上传'
      default:
        return ''
    }
  }

  const onTransferDone = () => {
    initState()
  }

  useEffect(() => {
    initState()
  }, [])

  return (
    <div className={styles['transfer-list-wrapper']}>
      {transfers.length > 0 ? (
        <>
          <div className={styles.toolbar}>
            <span
              className={styles['toolbar-left']}
            >{`总共 ${transfers.length} 项`}</span>
            <div className={styles['toolbar-right']} />
          </div>
          <section className={styles['transfer-table__wrapper']}>
            <table className={styles['transfer-table']}>
              <tbody>
                {transfers.map(item => (
                  <tr className={styles['transfer-table__row']} key={item.id}>
                    <td
                      className={classnames(
                        styles['transfer-table__row_item'],
                        styles.meta
                      )}
                    >
                      {/* <Icon
                        className="icon"
                        type={getIconName(item.name)}
                        style={{ fontSize: 30 }}
                      /> */}
                      <div className={styles['name-wrapper']}>
                        <div className={styles.name}>{item.name}</div>
                        <div className={styles.size}>
                          {fileSizeFormatter(item.size)}
                        </div>
                      </div>
                    </td>
                    <td
                      className={classnames(
                        styles['transfer-table__row_item'],
                        styles.progress
                      )}
                    >
                      {/* <Progress percent={item.progress} /> */}
                    </td>
                    <td className={styles['transfer-table__row_item type']}>
                      {typeFormatter(item.type)}
                    </td>
                    <td
                      className={classnames(
                        styles['transfer-table__row_item'],
                        styles.action
                      )}
                    >
                      123
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <>没有文件</>
      )}
    </div>
  )
}

export default TransferList
