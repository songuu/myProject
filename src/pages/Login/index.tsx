import React, { useState } from 'react'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { Icon } from '@components/index'

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
            <Icon type="icon-guanbi" />
          </div>
          <div
            className={styles['login-box-main-header-type']}
            onClick={() => {
              setLoginType(loginType === 'account' ? 'wechat' : 'account')
            }}
          >
            {loginType === 'account' ? (
              <Icon type="icon-qrcode" className={styles['svg-icon']} />
            ) : (
              <Icon type="icon-diannao" className={styles['svg-icon']} />
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
              <Icon type="icon-qrcode" className={styles['svg-icon']} />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null
}

export default Login
