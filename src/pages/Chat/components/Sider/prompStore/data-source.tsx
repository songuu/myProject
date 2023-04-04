import React, { useMemo, useState } from 'react'
import { Button, Table, TableColumnProps } from '@arco-design/web-react'

import { useAppSelector } from '@root/store'
interface IProps {
  handleEdit: (index: number) => void
  handleDelete: (index: number) => void
}

const DataTable: React.FC<IProps> = ({ handleEdit, handleDelete }) => {
  const promptList = useAppSelector(state => state.prompt.promptList)

  const [page, setPage] = useState(1)

  const [limit, setLimit] = useState(10)

  const columns: TableColumnProps[] = [
    {
      title: 'Key',
      dataIndex: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record, index) => {
        return (
          <div>
            <Button
              onClick={() => {
                handleEdit(index)
              }}
            >
              编辑
            </Button>
            <Button
              onClick={() => {
                handleDelete(index)
              }}
            >
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  const handlePageChange = (pagination: any) => {
    setPage(pagination.current)
    setLimit(pagination.pageSize)
  }

  const list = useMemo(() => {
    if (promptList.length) {
      return promptList.splice((page - 1) * limit, limit)
    }
    return []
  }, [promptList, page, limit])

  return (
    <div className="flex h-[400px]">
      <Table
        rowKey="id"
        columns={columns}
        data={list}
        onChange={handlePageChange}
      />
    </div>
  )
}

export default DataTable
