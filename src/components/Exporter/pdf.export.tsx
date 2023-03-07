import React from 'react'
import jsPDF from 'jspdf'

import Button from '../Button'

interface IPdfExporterProps {
  data: any
}

function PdfExporter({ data }: IPdfExporterProps) {
  const handleExport = () => {
    // 创建 PDF 对象
    const doc = new jsPDF()

    //
    // 定义表头
    const headers = [['Name', 'Age']]

    // 将表头和数据合并
    const rows = headers.concat(data.map(item => [item.name, item.age]))

    // 设置 PDF 字体
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')

    // 生成表格
    doc.autoTable({
      head: rows.slice(0, 1),
      body: rows.slice(1),
      startY: 20,
    })

    // 保存 PDF 文件
    doc.save('data.pdf')
  }

  return <Button onClick={handleExport}>Export Data</Button>
}

export default PdfExporter
