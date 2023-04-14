import React from 'react'

import { APPCATIONTITLE } from '@config/index'

import { Icon } from '@root/components'

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
        WebkitAppRegion: 'drag',
      }}
      className="w-full select-none h-[30px] bg-white dark:bg-[#24272e] border-[#f2f2f2] dark:border-[#1a1a1a] border-[1px] border-solid flex justify-between items-center"
    >
      <div className="pl-[5px] tracking-widest dark:text-white">
        {/* {APPCATIONTITLE} */}
      </div>
      <div
        className="select-auto flex items-center w-[75px]"
        style={{
          // @ts-ignore
          WebkitAppRegion: 'no-drag',
        }}
      >
        <p onClick={min}>
          <Icon type="icon-zuixiaohua" className="w-[24px] h-[24px]" />
        </p>
        <p onClick={toggle}>
          <Icon type="icon-zuidahua" className="w-[24px] h-[24px]" />
        </p>
        <p onClick={close}>
          <Icon type="icon-guanbi" className="w-[24px] h-[24px]" />
        </p>
      </div>
    </div>
  )
}

export default OperationHeader
