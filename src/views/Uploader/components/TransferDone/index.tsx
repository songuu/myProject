import React, { useState, useEffect } from 'react'

import classnames from 'classnames'

import { fileSizeFormatter, dateFormatter, getIconName } from '@libs/utils'

import { SvgIcon, Empty } from '@components/index'

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

const TransferDone = () => {
  const [transfers, setTransfers] = useState<TransferStore[]>([])

  const initState = async () => {
    const transferList = await window.Main.getTransfers({
      status: TransferStatus.done,
    })

    console.log(transferList)

    setTransfers(transferList.sort((a, b) => b.date - a.date))
  }

  const onClearTransferDoneList = async () => {
    await window.Main.clearTransferDoneList()
    setTransfers([])
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

  useEffect(() => {
    initState().then(r => r)
  }, [])

  return (
    <div className={styles['transfer-done-wrapper']}>
      {transfers.length > 0 ? (
        <>
          <div className={styles.toolbar}>
            <span
              className={styles['toolbar-left']}
            >{`总共 ${transfers.length} 项`}</span>
            <div className={styles['toolbar-right']}>
              <button onClick={onClearTransferDoneList}>清空记录</button>
            </div>
          </div>
          <section className={styles['transfer-table__wrapper']}>
            <table className={styles['transfer-table']}>
              <tbody>
                {transfers.map((item: TransferStore) => (
                  <tr
                    className={styles['transfer-table__row']}
                    key={item.id + item.name}
                  >
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
                    <td className={styles['transfer-table__row_item']}>
                      {typeFormatter(item.type)}
                    </td>
                    <td>{dateFormatter(item.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <Empty title="没有文件" description="没有找到传输列表" />
      )}
    </div>
  )
}

export default TransferDone
