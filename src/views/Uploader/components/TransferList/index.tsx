import React, { useState, useEffect } from 'react'

import classnames from 'classnames'

import { fileSizeFormatter, getIconName } from '@libs/utils'

import { Empty, Progress, Icon } from '@components/index'

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
        return (
          <Icon type="icon-download" className="h-[24px] w-[24px] p-[5px] dark:text-white" />
        )
      case TaskType.upload:
        return <Icon type="icon-upload" className="h-[24px] w-[24px] p-[5px] dark:text-white" />
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
    <div className="h-full flex flex-col">
      {transfers.length > 0 ? (
        <>
          <div className="h-[30px] px-[10px] flex flex-row justify-between items-center">
            <span className="dark:text-white">{`总共 ${transfers.length} 项`}</span>
          </div>
          <section className="flex-1 overflow-auto">
            <table className="w-full">
              <tbody>
                {transfers.map(item => (
                  <tr
                    className="p-[10px] border-t-solid border-t-[1px] border-t-gray-100 h-[50px] box-border flex items-center"
                    key={item.id}
                  >
                    <td className="w-[300px] flex flex-row items-center">
                      <Icon
                        type={getIconName(item.name)}
                        className="w-[40px] y-[40px] text-[30px] p-[5x]"
                      />
                      <div className="flex flex-row justify-center items-center">
                        <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap dark:text-white text-xs">
                          {item.name}
                        </div>
                        <div className="text-[12px] text-[#999] dark:text-white">
                          {fileSizeFormatter(item.size)}
                        </div>
                      </div>
                    </td>
                    <td className="w-[200px]">
                      <Progress
                        percent={item.progress}
                        size="small"
                        // status="warning"
                      />
                    </td>
                    <td className="w-[60px]">{typeFormatter(item.type)}</td>
                    <td className={classnames('w-[60px] dark:text-white text-xs')}>
                      操作
                    </td>
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

export default TransferList
