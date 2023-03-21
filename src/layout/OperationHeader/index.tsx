import React from 'react'

import { APPCATIONTITLE } from '@config/index'

import styles from './index.module.less'

function OperationHeader() {
  // 关闭窗口
  const close = () => {
    window.Main.closeWindow()
  }
  // 最小化窗口
  const min = () => {
    window.Main.minWindow()
  }
  // 切换窗口状态：如果当前状态是最大化则取消最大化，否则最大化
  const toggle = () => {
    window.Main.toggleWindow()
  }
  return (
    <div
      style={{
        // @ts-ignore
        '-webkit-app-region': 'drag',
      }}
      className="w-full select-none h-[30px] bg-white border-[#f2f2f2] border-[1px] border-solid flex justify-between items-center"
    >
      <div className="pl-[5px] tracking-widest">{APPCATIONTITLE}</div>
      <div
        className="select-auto flex items-center w-[75px]"
        style={{
          // @ts-ignore
          '-webkit-app-region': 'no-drag',
        }}
      >
        <p onClick={min} className="text-[#999] pl-[10px] inline-block m-[5px]">
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4589"
            width="15"
            height="15"
          >
            <path
              d="M128 512h768a25.6 25.6 0 1 1 0 51.2h-768a25.6 25.6 0 1 1 0-51.2z"
              p-id="4590"
              fill="#616161"
            ></path>
          </svg>
        </p>
        <p onClick={toggle}>
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2822"
            width="15"
            height="15"
          >
            <path
              d="M392.997283 316.444846l-78.14777 0 0 78.148793 78.14777 0L392.997283 316.444846zM392.997283 472.791551l-78.14777 0 0 78.156979 78.14777 0L392.997283 472.791551zM392.997283 160.15033c-42.993144 0-78.14777 35.14644-78.14777 78.148793l78.14777 0L392.997283 160.15033zM549.359337 629.145418l-78.14777 0 0 78.14777 78.14777 0L549.359337 629.145418zM783.844602 160.15033l0 78.148793 78.14777 0C861.992371 195.295746 826.79579 160.15033 783.844602 160.15033M549.359337 160.15033l-78.14777 0 0 78.148793 78.14777 0L549.359337 160.15033zM392.997283 707.293188l0-78.14777-78.14777 0C314.849513 672.081257 350.004139 707.293188 392.997283 707.293188M783.844602 550.94853l78.14777 0 0-78.156979-78.14777 0L783.844602 550.94853zM783.844602 394.642758l78.14777 0 0-78.14777-78.14777 0L783.844602 394.642758zM783.844602 707.293188c42.952211 0 78.14777-35.211931 78.14777-78.14777l-78.14777 0L783.844602 707.293188zM236.718116 316.444846l-78.206098 0 0 78.197912 0 390.797177c0 43.043286 35.14644 78.196888 78.206098 78.196888l468.977692 0 0-78.196888-468.977692 0L236.718116 316.444846zM627.49892 238.2981l78.14777 0 0-78.148793-78.14777 0L627.49892 238.2981zM627.49892 707.293188l78.14777 0 0-78.14777-78.14777 0L627.49892 707.293188z"
              p-id="2823"
              fill="#616161"
            ></path>
          </svg>
        </p>
        <p onClick={close}>
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1996"
            width="15"
            height="15"
          >
            <path
              d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z"
              p-id="1997"
              fill="#616161"
            ></path>
          </svg>
        </p>
      </div>
    </div>
  )
}

export default OperationHeader
