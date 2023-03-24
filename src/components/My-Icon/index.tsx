import React, { useEffect, useState } from 'react'

interface IconFontProps {
  type?: string
  className?: string
  promise: Promise<any>
}

const IconFont: React.FC<IconFontProps> = ({
  type,
  className = '',
  promise,
}) => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    promise.then(() => {
      setReady(true)
    })
  }, [promise])
  if (!ready) {
    return null
  }
  return (
    <svg className={`icon text-current text-base ${className}`} aria-hidden="true">
      <use color="currentColor" xlinkHref={`#${type}`} />
    </svg>
  )
}

interface CustomCreateFromIconfontCNOptions {
  scriptUrl?: string | string[]
}

const iconfontUrl = ''

const customCreateFromIconfontCN = (
  options: CustomCreateFromIconfontCNOptions = {}
) => {
  const { scriptUrl, ...restOptions } = options
  const scriptUrls = Array.isArray(scriptUrl) ? scriptUrl : [scriptUrl]
  const url: any = scriptUrls.length > 0 ? scriptUrls[0] : iconfontUrl
  const customSymbolScriptUrl = url.indexOf('.js') === -1 ? `${url}.js` : url
  let promise: Promise<any>
  return (props: { [key: string]: any }) => {
    if (!promise) {
      promise = new Promise(resolve => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.onload = () => {
          resolve(void 0)
        }
        script.onerror = () => {
          resolve(void 0)
        }
        script.src = customSymbolScriptUrl
        document.body.appendChild(script)
      })
    }
    return <IconFont {...restOptions} {...props} promise={promise} />
  }
}

const OuterIconFont = customCreateFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_1888492_y6quvb5d3uk.js',
})

interface IconProps {
  type: string
  className?: string
}

const Icon: React.FC<IconProps> = ({ type, className = '' }) => {
  return <OuterIconFont type={type} className={className} />
}

export default Icon
