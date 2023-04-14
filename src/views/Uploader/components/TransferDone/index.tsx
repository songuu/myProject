import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

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
          <Icon
            type="icon-download"
            className="h-[24px] w-[24px] p-[5px] dark:text-white"
          />
        )
      case TaskType.upload:
        return (
          <Icon
            type="icon-upload"
            className="h-[24px] w-[24px] p-[5px] dark:text-white"
          />
        )
      default:
        return ''
    }
  }

  useEffect(() => {
    initState().then(r => r)
  }, [])

  return (
    <div className="flex h-full flex-col">
      {transfers.length > 0 ? (
        <>
          <div className="flex h-[30px] flex-row items-center justify-between px-[10px]">
            <span className="dark:text-white">{`${t('file.total')} ${
              transfers.length
            }`}</span>
          </div>
          <section className="flex-1 overflow-auto">
            <table className="w-full">
              <tbody>
                {transfers.map((item: TransferStore) => (
                  <tr
                    className="border-t-solid box-border flex h-[50px] items-center border-t-[1px] border-t-gray-100 p-[10px]"
                    key={item.id + item.name}
                  >
                    <td className="flex w-[300px] flex-row items-center">
                      <Icon
                        type={getIconName(item.name)}
                        className="y-[40px] w-[40px] p-[5x] text-[30px]"
                      />
                      <div className="flex flex-row items-center justify-center">
                        <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-xs dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-[12px] text-[#999] dark:text-white">
                          {fileSizeFormatter(item.size)}
                        </div>
                      </div>
                    </td>
                    <td className="w-[60px]">{typeFormatter(item.type)}</td>
                    <td className="w-[200px] text-xs dark:text-white">
                      {dateFormatter(item.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <Empty
          title={`${t('file.none')} ${t('file.file')}`}
          description={t('file.transportListNotFound')}
        />
      )}
    </div>
  )
}

export default TransferDone
