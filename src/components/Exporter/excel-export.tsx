import React from 'react'
import XLSX from 'xlsx'
import Button from '../Button'

interface IExcelExporterProps {
  data: any
}

function ExcelExporter({ data }: IExcelExporterProps) {
  const handleExport = () => {
    // 创建工作簿
    const wb = XLSX.utils.book_new()

    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(data)

    // 将工作表添加到工作簿中
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // 生成 Excel 文件
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' })

    // 下载 Excel 文件
    const filename = 'data.xlsx'
    if (window.navigator.msSaveOrOpenBlob) {
      // 兼容 IE 浏览器
      const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
      window.navigator.msSaveBlob(blob, filename)
    } else {
      const url = window.URL.createObjectURL(
        new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
      )
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  // 字符串转字符流
  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }

  return <Button onClick={handleExport}>Export Data</Button>
}

export default ExcelExporter
