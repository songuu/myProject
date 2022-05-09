import React, { MouseEvent, ReactElement, useCallback, useRef, useState } from 'react'
import ScreenshotsContext from './ScreenshotsContext'
import ScreenshotsBackground from './ScreenshotsBackground'
import ScreenshotsCanvas from './ScreenshotsCanvas'
import ScreenshotsOperations from './ScreenshotsOperations'
import { Bounds, Emiter, History } from './types'
import useGetLoadedImage from './useGetLoadedImage'
import zhCN, { Lang } from './zh_CN'
import './icons/iconfont.less'
import './screenshots.less'

export interface ScreenshotsProps {
  url?: string
  width: number
  height: number
  lang?: Partial<Lang>
  className?: string
  [key: string]: unknown
}

export default function Screenshots ({ url, width, height, lang, className, ...props }: ScreenshotsProps): ReactElement {
  const image = useGetLoadedImage(url)
  const canvasContextRef = useRef<CanvasRenderingContext2D>(null)
  const emiterRef = useRef<Emiter>({})
  const [history, setHistory] = useState<History>({
    index: -1,
    stack: []
  })
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [cursor, setCursor] = useState<string | undefined>('move')
  const [operation, setOperation] = useState<string | undefined>(undefined)

  const store = {
    url,
    width,
    height,
    image,
    lang: {
      ...zhCN,
      ...lang
    },
    emiterRef,
    canvasContextRef,
    history,
    bounds,
    cursor,
    operation
  }

  const call = useCallback(
    <T extends unknown[]>(funcName: string, ...args: T) => {
      const func = props[funcName]
      if (typeof func === 'function') {
        func(...args)
      }
    },
    [props]
  )

  const dispatcher = {
    call,
    setHistory,
    setBounds,
    setCursor,
    setOperation
  }

  const classNames = ['screenshots']

  if (className) {
    classNames.push(className)
  }

  const reset = () => {
    emiterRef.current = {}
    setHistory({
      index: -1,
      stack: []
    })
    setBounds(null)
    setCursor('move')
    setOperation(undefined)
  }

  const onDoubleClick = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0 || !bounds || !canvasContextRef.current) {
        return
      }
      canvasContextRef.current.canvas.toBlob(blob => {
        call('onOk', blob, bounds)
        reset()
      }, 'image/png')
    },
    [bounds, call]
  )

  const onContextMenu = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 2) {
        return
      }
      e.preventDefault()
      call('onCancel')
      reset()
    },
    [call]
  )

  return (
    <ScreenshotsContext.Provider value={{ store, dispatcher }}>
      <div
        className={classNames.join(' ')}
        style={{ width, height }}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <ScreenshotsBackground />
        <ScreenshotsCanvas ref={canvasContextRef} />
        <ScreenshotsOperations />
      </div>
    </ScreenshotsContext.Provider>
  )
}
