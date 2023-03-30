import React, { useState } from 'react'
import { useStyletron } from 'baseui'
import {
  StatefulDataTable,
  CustomColumn,
  StringColumn,
} from 'baseui/data-table'

import { Pagination } from 'baseui/pagination'

import { Button } from '@components/index'

type DataType = {
  title: string
  description: string
}

const DataTable = () => {
  const [css] = useStyletron()
  const [list, setList] = useState([
    {
      id: '1',
      data: { title: 'test', description: 'test' },
    },
  ])

  const [page, setPage] = useState(1)

  const [limit, setLimit] = useState(10)

  const columns = [
    StringColumn({
      title: '名称',
      mapDataToValue: (data: DataType) => data.title,
    }),
    StringColumn({
      title: '描述',
      mapDataToValue: (data: DataType) => data.description,
    }),
    CustomColumn({
      title: '动作',
      mapDataToValue: () => null,
      renderCell: function Cell(props: any) {
        return (
          <div className="w-[150px] flex justify-between">
            <Button size="small" type="primary">
              编辑
            </Button>
            <Button size="small" status="danger">
              删除
            </Button>
          </div>
        )
      },
    }),
  ]

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1) {
      return
    }
    setPage(nextPage)
  }
  return (
    <div className="h-[400px] flex flex-col">
      <div className="flex-1">
        <StatefulDataTable
          filterable={false}
          searchable={false}
          columns={columns}
          rows={list}
        />
      </div>
      <Pagination
        currentPage={page}
        numPages={10}
        onPageChange={({ nextPage }) => handlePageChange(nextPage)}
        labels={{
          prevButton: '上一页',
          nextButton: '下一页',
          preposition: '共'
        }}
      />
    </div>
  )
}

export default DataTable
