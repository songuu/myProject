import React, { useState, useEffect } from 'react'

import classnames from 'classnames'

import { fileSizeFormatter, getIconName } from '@libs/utils'

import { SvgIcon } from '@components/index'

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

    const transfer = transferList.map((item: TransferStore) => ({
      ...item,
      progress: 0,
    }))

    setTransfers(transfer)
  }

  const typeFormatter = (type: TaskType) => {
    switch (type) {
      case TaskType.download:
        return <SvgIcon iconName="download" iconClass={styles.icon1} />
      case TaskType.upload:
        return <SvgIcon iconName="upload" iconClass={styles.icon1} />
      default:
        return ''
    }
  }

  const onProgress = async (e: any, list: ProgressListType[]) => {
    const transferList = await window.Main.getTransfers({
      status: TransferStatus.default,
    })

    const transfer = transferList.map(item => {
      const progress = list.find(i => i.id === item.id)
      return {
        ...item,
        progress: progress ? progress.progress : 0,
      }
    })

    setTransfers(transfer)
  }

  const onTransferDone = () => {
    initState()
  }

  useEffect(() => {
    initState()

    window.Main.on('transfer-progress', onProgress)
    window.Main.on('transfer-finish', onTransferDone)

    return () => {
      window.Main.off('transfer-progress', onProgress)
      window.Main.off('transfer-finish', onTransferDone)
    }
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
                      <SvgIcon
                        iconName={getIconName(item.name)}
                        iconClass={styles.icon}
                      />
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
                    <td className={styles['transfer-table__row_item']}>
                      {typeFormatter(item.type)}
                    </td>
                    <td
                      className={classnames(
                        styles['transfer-table__row_item'],
                        styles.action
                      )}
                    >
                      操作
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
