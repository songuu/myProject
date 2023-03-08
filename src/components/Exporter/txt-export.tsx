import React from 'react'

import Button from '@components/Button'

interface ITxtExporterProps {
  data: any
  keys: string[]
}

function TxtExporter({ data, keys }: ITxtExporterProps) {
  const handleExport = () => {
    const text = data.map(item => keys.map(key => `${item[key]}`)).join('\n')

    const filename = 'data.txt'
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    if (window?.navigator?.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename)
    } else {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  return <Button onClick={handleExport}>txt导出</Button>
}

export default TxtExporter
