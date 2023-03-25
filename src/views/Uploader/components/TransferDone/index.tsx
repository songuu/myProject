import React, { useState, useEffect } from 'react'

import { fileSizeFormatter, dateFormatter, getIconName } from '@libs/utils'

import { Empty, Icon } from '@components/index'

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

    setTransfers(transferList.sort((a, b) => b.date - a.date))
  }

  const onClearTransferDoneList = async () => {
    await window.Main.clearTransferDoneList()
    setTransfers([])
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

  useEffect(() => {
    initState().then(r => r)
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
                {transfers.map((item: TransferStore) => (
                  <tr
                    className="p-[10px] border-t-solid border-t-[1px] border-t-gray-100 h-[50px] box-border flex items-center"
                    key={item.id + item.name}
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
                    <td className="w-[60px]">{typeFormatter(item.type)}</td>
                    <td className="w-[200px] dark:text-white text-xs">{dateFormatter(item.date)}</td>
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
