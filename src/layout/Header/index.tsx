import React, { useRef, useState } from 'react'

import { NavLink, useNavigate } from 'react-router-dom'

import { useAppDispatch } from '@root/store/index'

import { ContextMenu, SvgIcon, ButtonIcon } from '@components/index'

import { MenuImperativeProps, ContextItem } from '@components/ContextMenu/index'

import { setShowLogin } from '@root/store/actions'

import defaultAvatar from '@imgs/default-avatar.png'

import styles from './index.module.less'

interface IBaseHeaderProps {}

const Header: React.FC<IBaseHeaderProps> = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [inputFocus, setInputFocus] = useState<boolean>(false)

  const contextRef = useRef<MenuImperativeProps>(null)

  return (
    <div className={styles.header}>
      <div className={styles['navigation-buttons']}>
        <ButtonIcon onclick={() => navigate(-1)}>
          <SvgIcon iconName="arrow-left" iconClass={styles['svg-icon']} />
        </ButtonIcon>
        <ButtonIcon onclick={() => navigate(1)}>
          <SvgIcon iconName="arrow-right" iconClass={styles['svg-icon']} />
        </ButtonIcon>
      </div>
      <div className={styles['header-links']}>
        <NavLink
          style={status => ({ color: status.isActive ? '#335eea' : '#000' })}
          to="/main_window/home"
        >
          首页
        </NavLink>
        <NavLink
          style={status => ({ color: status.isActive ? '#335eea' : '#000' })}
          to="/main_window/explore"
        >
          发现
        </NavLink>
        <NavLink
          style={status => ({ color: status.isActive ? '#335eea' : '#000' })}
          to="/main_window/library?category=全部应用"
        >
          我的
        </NavLink>
        <NavLink
          style={status => ({ color: status.isActive ? '#335eea' : '#000' })}
          to="/main_window/answer"
        >
          问答
        </NavLink>
        <NavLink
          style={status => ({ color: status.isActive ? '#335eea' : '#000' })}
          to="/main_window/chat"
        >
          对话
        </NavLink>
      </div>
      <div className={styles['header-right']}>
        <div className={styles['header-right-search']}>
          <div
            className={`${styles.container} ${inputFocus ? styles.active : ''}`}
          >
            <SvgIcon iconName="search" iconClass={styles['svg-icon']} />
            <div className={styles.input}>
              <input
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
          className={styles['header-right-avatar']}
          src={defaultAvatar}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            contextRef.current?.openMenu(e)
          }}
        />
      </div>
      <ContextMenu ref={contextRef}>
        <ContextItem
          onclick={() =>
            navigate({
              pathname: '/main_window/setting',
            })
          }
        >
          <SvgIcon iconName="settings" iconClass={styles['svg-icon']} />
          <span>设置</span>
        </ContextItem>
        <ContextItem
          onclick={() => {
            dispatch(setShowLogin())
          }}
        >
          <SvgIcon iconName="login" iconClass={styles['svg-icon']} />
          <span>登录</span>
        </ContextItem>
        <ContextItem>
          <SvgIcon iconName="logout" iconClass={styles['svg-icon']} />
          <span>登出</span>
        </ContextItem>
      </ContextMenu>
    </div>
  )
}

export default Header
