import React, { useMemo, useRef, useState } from 'react'

import { NavLink, useNavigate } from 'react-router-dom'

import { Modal, ModalHeader, ModalBody, ROLE } from 'baseui/modal'

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
    <div className="box-border dark:bg-[#1a1a1a] text-[#040F42] text-opacity-90 flex  justify-between h-[59px] leading-[59px] overflow-hidden px-[18px]">
      <div className="flex items-center">
        <ButtonIcon onclick={() => navigate(-1)}>
          <Icon type="icon-xiangyou" className="w-[16px] h-[16px]" />
        </ButtonIcon>
        <ButtonIcon onclick={() => navigate(1)}>
          <Icon type="icon-xiangzuo" className="w-[16px] h-[16px]" />
        </ButtonIcon>
      </div>
      <div className="flex-1 min-w-[250px] h-full select-none overflow-x-auto overflow-y-hidden items-center flex">
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
              className="flex-shrink-0 mx-[12px] py-[6px] px-[10px] text-[18px] font-bold  text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.92] transition-colors duration-200 cursor-default"
            >
              {item.name}
            </NavLink>
          )
        })}
      </div>
      <div className="w-[242px] flex items-center justify-end">
        <div
          className="flex justify-end"
          style={{
            // @ts-ignore
            WebkitAppRegion: 'no-drag',
          }}
        >
          <div
            className={`flex items-center h-[32px] rounded-[8px] w-[200px] bg-[#D1D1D6] bg-opacity-25  ${
              inputFocus ? 'bg-[#BDCFFF] bg-opacity-30' : ''
            }`}
          >
            <Icon
              type="icon-sousuo"
              className={`bg-opacity-25 ml-[8px] mr-[4px] ${focusClass}`}
            />
            <div className="font-sans">
              <input
                className={`text-lg border-0 bg-transparent mt-[-1px] w-full font-semibold ${focusClass}`}
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
          className="h-[30px] select-none ml-[10px] rounded-full cursor-pointer app-region-drag user-drag-none hover:filter hover:brightness-75 transition-all duration-200"
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
          <Icon type="icon-shezhi" className="w-[15px] h-[15px] mr-2" />
          <span>设置</span>
        </ContextItem>
        <ContextItem
          onclick={() => {
            dispatch(setShowLogin())
          }}
        >
          <Icon type="icon-sign-in-alt" className="w-[15px] h-[15px] mr-2" />
          <span>登录</span>
        </ContextItem>
        <ContextItem>
          <Icon type="icon-sign-out-alt" className="w-[15px] h-[15px] mr-2" />
          <span>登出</span>
        </ContextItem>
      </ContextMenu>
      <Modal
        onClose={handleClose}
        closeable
        isOpen={isOpen}
        animate
        autoFocus
        size={720}
        role={ROLE.dialog}
      >
        <div className="w-[720px]">
          <ModalHeader>设置</ModalHeader>
          <ModalBody>
            <SettingModal />
          </ModalBody>
        </div>
      </Modal>
    </div>
  )
}

export default Header
