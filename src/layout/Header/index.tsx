import React, { useState } from 'react'

import { NavLink, useLocation } from 'react-router-dom';

import { ContextMenu, SvgIcon } from '@components/index';

import defaultAvatar from '@imgs/default-avatar.png';

import styles from './index.module.less'

interface IBaseHeaderProps { }

const Header: React.FC<IBaseHeaderProps> = () => {
  const [inputFocus, setInputFocus] = useState<boolean>(false);

  return <div className={styles.header}>
    <div className={styles['header-links']}>
      <NavLink
        style={(status) => ({ color: status.isActive ? '#335eea' : '#000' })}
        to="/main_window/home"
      >首页</NavLink>
      <NavLink
        style={(status) => ({ color: status.isActive ? '#335eea' : '#000' })}
        to="/main_window/explore"
      >发现</NavLink>
      <NavLink
        style={(status) => ({ color: status.isActive ? '#335eea' : '#000' })}
        to="/main_window/library"
      >我的</NavLink>
    </div>
    <div className={styles['header-right']}>
      <div className={styles['header-right-search']}>
        <div className={`${styles.container} ${inputFocus ? styles.active : ''}`}>
          <SvgIcon iconName='search' />
          <div className={styles.input}>
            <input
              type="search"
              placeholder='搜索'
              onFocus={() => {
                setInputFocus(true);
              }}
              onBlur={() => {
                setInputFocus(false);
              }}
            />
          </div>
        </div>
      </div>
      <img className={styles['header-right-avatar']} src={defaultAvatar} />
    </div>
    <ContextMenu visible={false}></ContextMenu>
  </div>
}

export default Header
