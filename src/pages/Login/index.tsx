import React, { useState } from 'react'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { SvgIcon } from '@components/index'

import { setShowLogin } from '@root/store/actions'

import styles from './index.module.less'

/*
 * 登陆
 * 1. 账号密码登陆 account
 * 2. 微信扫码登陆 wechat
 *
 */
const Login = () => {
  const dispatch = useAppDispatch()
  const showLogin = useAppSelector(state => state.app.showLogin)

  const [loginType, setLoginType] = useState('account')

  return showLogin ? (
    <div className={styles['login-box']}>
      <div className={styles['login-box-main']}>
        <div className={styles['login-box-main-header']}>
          <div
            className={styles['login-box-main-header-close']}
            onClick={() => {
              dispatch(setShowLogin())
            }}
          >
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1996"
              width="24"
              height="24"
            >
              <path
                d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z"
                p-id="1997"
                fill="#676767"
              ></path>
            </svg>
          </div>
          <div
            className={styles['login-box-main-header-type']}
            onClick={() => {
              setLoginType(loginType === 'account' ? 'wechat' : 'account')
            }}
          >
            {loginType === 'account' ? (
              <SvgIcon iconName="qrcode" iconClass={styles['svg-icon']} />
            ) : (
              <SvgIcon iconName="computer" iconClass={styles['svg-icon']} />
            )}
          </div>
        </div>
        {loginType === 'account' ? (
          <div className={styles['login-box-main-contain']}>
            <h2>账号登陆</h2>
            <form>
              <div className={styles['user-box']}>
                <input type="text" name="" required />
                <label>账号</label>
              </div>
              <div className={styles['user-box']}>
                <input type="password" name="" required />
                <label>密码</label>
              </div>
              <div className={styles['login-box-btn']}>
                <a href="#">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  登陆
                </a>

                <a href="#">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  注册
                </a>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles['login-box-main-contain']}>
            <h2>微信扫码登陆</h2>
            <div className={styles['login-box-main-qrcode']}>
              <SvgIcon iconName="qrcode" iconClass={styles['svg-icon']} />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null
}

export default Login
