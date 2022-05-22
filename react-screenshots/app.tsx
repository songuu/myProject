import React, { useCallback, useState, useEffect } from 'react'
import Screenshots from './Screenshots'
import { Bounds } from './Screenshots/types'
import './app.less'

interface IAppProps {}
export interface Display {
  id: number
  x: number
  y: number
  width: number
  height: number
}

const App: React.FC<IAppProps> = () => {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const [display, setDisplay] = useState<Display | undefined>(undefined)

  const onSave = useCallback(
    async (blob: Blob | null, bounds: Bounds) => {
      if (!display || !blob) {
        return
      }
      window.screenshots.save(await blob.arrayBuffer(), { bounds, display })
    },
    [display]
  )

  const onCancel = useCallback(() => {
    window.screenshots.cancel()
  }, [])

  const onOk = useCallback(
    async (blob: Blob | null, bounds: Bounds) => {
      if (!display || !blob) {
        return
      }
      window.screenshots.ok(await blob.arrayBuffer(), { bounds, display })
    },
    [display]
  )

  const onUpload = useCallback(
    async (blob: Blob | null, bounds: Bounds) => {
      if (!display || !blob) {
        return
      }
      window.screenshots.upload(await blob.arrayBuffer(), { bounds, display })
    },
    [display]
  )

  useEffect(() => {
    // 告诉主进程页面准备完成
    window.screenshots.ready()
    // display: Display, dataURL: string

    const onCapture =  (display: Display, dataURL: string) => {
      setDisplay(display)
      setUrl(dataURL)
    }

    window.screenshots.on('capture', onCapture)

    return () => {
      // window.screenshots.off('capture', onCapture)
    }
  }, [])

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    const onKeyup = ({ code }: KeyboardEvent) => {
      if (code === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('keyup', onKeyup)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keyup', onKeyup)
    }
  }, [onCancel])

  return (
    <div className="body">
      <Screenshots
        url={url}
        width={width}
        height={height}
        onSave={onSave}
        onCancel={onCancel}
        onOk={onOk}
        onUpload={onUpload}
      />
    </div>
  )
}

export default App
