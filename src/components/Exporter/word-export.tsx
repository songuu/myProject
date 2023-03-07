import JSZip from 'jszip'
import Docxtemplater from 'docxtemplater'

interface IWordExporterProps {
  data: any
}

function WordExporter({ data }: IWordExporterProps) {
  const handleExport = () => {
    const zip = new JSZip()

    // 加载 Word 模板文件
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/template.docx', true)
    xhr.responseType = 'arraybuffer'

    xhr.onload = () => {
      const buffer = xhr.response

      // 使用 docxtemplater 生成带有数据的 Word 文档
      const doc = new Docxtemplater()
      doc.loadZip(new JSZip(buffer))
      doc.setData({
        items: data,
      })
      doc.render()

      const docx = doc.getZip().generate({ type: 'blob' })

      // 下载 Word 文档
      const filename = 'data.docx'
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(docx, filename)
      } else {
        const url = URL.createObjectURL(docx)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    }

    xhr.send()
  }

  return <button onClick={handleExport}>Export Data</button>
}

export default WordExporter
