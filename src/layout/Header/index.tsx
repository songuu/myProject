import React, { useMemo, useRef, useState } from 'react'

import { NavLink, useNavigate } from 'react-router-dom'

import { Modal } from '@arco-design/web-react'

import { useAppDispatch } from '@root/store/index'

import { ContextMenu, ButtonIcon, Icon } from '@components/index'

import { MenuImperativeProps, ContextItem } from '@components/ContextMenu/index'

import { setShowLogin } from '@root/store/actions'

import defaultAvatar from '@imgs/default-avatar.png'

import SettingModal from '@root/views/Setting'

interface IBaseHeaderProps {}

const links = [
  {
    name: '首页',
    to: '/main_window/home',
  },
  {
    name: '发现',
    to: '/main_window/explore',
  },
  {
    name: '我的',
    to: '/main_window/library?category=全部应用',
  },
  {
    name: '问答',
    to: '/main_window/answer',
  },
  {
    name: '对话',
    to: '/main_window/chat',
  },
]

const Header: React.FC<IBaseHeaderProps> = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [inputFocus, setInputFocus] = useState<boolean>(false)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const contextRef = useRef<MenuImperativeProps>(null)

  const handleClose = () => {
    setIsOpen(false)
  }

  const focusClass = useMemo(() => {
    return inputFocus
      ? 'bg-opacity-100 text-[#335eea] dark:text-white'
      : 'text-black'
  }, [inputFocus])

  return (
    <div className="box-border flex h-[59px] justify-between overflow-hidden  px-[18px] leading-[59px] text-[#040F42] text-opacity-90 dark:bg-[#1a1a1a]">
      <div className="flex items-center">
        <ButtonIcon classname="text-gray-500" onclick={() => navigate(-1)}>
          <Icon type="icon-xiangyou" className="h-[16px] w-[16px]" />
        </ButtonIcon>
        <ButtonIcon classname="text-gray-500" onclick={() => navigate(1)}>
          <Icon type="icon-xiangzuo" className="h-[16px] w-[16px]" />
        </ButtonIcon>
      </div>
      <div className="flex h-full min-w-[250px] flex-1 select-none items-center overflow-x-auto overflow-y-hidden">
        {links.map((item, index) => {
          return (
            <NavLink
              key={index}
              style={status => ({
                WebkitAppRegion: 'no-drag',
                WebkitUserDrag: 'none',
                color: status.isActive ? '#335eea' : '',
              })}
              to={item.to}
              className="mx-[12px] flex-shrink-0 cursor-default py-[6px] px-[10px] text-[18px]  font-bold text-black transition-colors duration-200 hover:bg-gray-200 active:scale-[0.92] dark:text-white dark:hover:bg-gray-600"
            >
              {item.name}
            </NavLink>
          )
        })}
      </div>
      <div className="flex w-[242px] items-center justify-end">
        <div
          className="flex justify-end"
          style={{
            // @ts-ignore
            WebkitAppRegion: 'no-drag',
          }}
        >
          <div
            className={`flex h-[32px] w-[200px] items-center rounded-[8px] bg-[#D1D1D6] bg-opacity-25  ${
              inputFocus ? 'bg-[#BDCFFF] bg-opacity-30' : ''
            }`}
          >
            <Icon
              type="icon-sousuo"
              className={`ml-[8px] mr-[4px] bg-opacity-25 ${focusClass}`}
            />
            <div className="font-sans">
              <input
                className={`mt-[-1px] w-full border-0 bg-transparent text-lg font-semibold ${focusClass}`}
                type="search"
                placeholder="搜索"
                onFocus={() => {
                  setInputFocus(true)
                }}
                onBlur={() => {
                  setInputFocus(false)
                }}
              />
            </div>
          </div>
        </div>
        <img
          className="app-region-drag user-drag-none ml-[10px] h-[30px] cursor-pointer select-none rounded-full transition-all duration-200 hover:brightness-75 hover:filter"
          src={defaultAvatar}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            contextRef.current?.openMenu(e)
          }}
        />
      </div>
      <ContextMenu ref={contextRef}>
        <ContextItem
          onclick={() =>
            /* navigate({
              pathname: '/main_window/setting',
            }) */
            setIsOpen(true)
          }
        >
          <Icon type="icon-shezhi" className="mr-2 h-[15px] w-[15px]" />
          <span>设置</span>
        </ContextItem>
        <ContextItem
          onclick={() => {
            dispatch(setShowLogin())
          }}
        >
          <Icon type="icon-sign-in-alt" className="mr-2 h-[15px] w-[15px]" />
          <span>登录</span>
        </ContextItem>
        <ContextItem>
          <Icon type="icon-sign-out-alt" className="mr-2 h-[15px] w-[15px]" />
          <span>登出</span>
        </ContextItem>
      </ContextMenu>
      <Modal
        title="设置"
        onCancel={handleClose}
        onOk={handleClose}
        visible={isOpen}
        autoFocus={true}
        wrapClassName="w-[720px]"
      >
        <SettingModal />
      </Modal>
    </div>
  )
}

export default Header
