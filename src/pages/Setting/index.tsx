import React from 'react'

import { SvgIcon } from '@components/index'

import classnames from 'classnames'

import styles from './index.module.less'

import defaultAvatar from '@imgs/default-avatar.png'

const shorts = [
  {
    id: 'play',
    name: '播放/暂停',
    shortcut: 'CommandOrControl+P',
    globalShortcut: 'Alt+CommandOrControl+P',
  },
  {
    id: 'next',
    name: '下一首',
    shortcut: 'CommandOrControl+Right',
    globalShortcut: 'Alt+CommandOrControl+Right',
  },
  {
    id: 'previous',
    name: '上一首',
    shortcut: 'CommandOrControl+Left',
    globalShortcut: 'Alt+CommandOrControl+Left',
  },
  {
    id: 'increaseVolume',
    name: '增加音量',
    shortcut: 'CommandOrControl+Up',
    globalShortcut: 'Alt+CommandOrControl+Up',
  },
  {
    id: 'decreaseVolume',
    name: '减少音量',
    shortcut: 'CommandOrControl+Down',
    globalShortcut: 'Alt+CommandOrControl+Down',
  },
  {
    id: 'like',
    name: '喜欢歌曲',
    shortcut: 'CommandOrControl+L',
    globalShortcut: 'Alt+CommandOrControl+L',
  },
  {
    id: 'minimize',
    name: '隐藏/显示播放器',
    shortcut: 'CommandOrControl+M',
    globalShortcut: 'Alt+CommandOrControl+M',
  },
]

const Setting = () => {
  return (
    <div className={styles['setting-page']}>
      <div className={styles['setting-page-container']}>
        <div className={styles['setting-page-useinfo']}>
          <div className={styles['setting-page-left']}>
            <img className={styles.avatar} src={defaultAvatar} />
            <div className={styles.info}>
              <div className={styles.nickname}>user</div>
              <div className={styles['extra-info']}>12</div>
            </div>
          </div>
          <div className={styles['setting-page-right']}>
            <button>
              <SvgIcon iconName="logout" iconClass={styles['svg-icon']} />
              <span>登出</span>
            </button>
          </div>
        </div>
        <div className={styles['setting-page-items']}>
          <h3>快捷键</h3>
          <div className={styles['setting-page-item']}>
            <div className={styles['setting-page-left']}>
              <div className={styles['setting-page-item-title']}>
                启用全局快捷键
              </div>
            </div>
            <div className={styles['setting-page-right']}>
              <div className={styles.toggle}>
                <input
                  id="enable-enable-global-shortcut"
                  type="checkbox"
                  name="enable-enable-global-shortcut"
                />
                <label htmlFor="enable-enable-global-shortcut"></label>
              </div>
            </div>
          </div>
          <div
            id="shortcut-table"
            className={styles['shortcut-table']}
            tabIndex={0}
            onKeyDown={() => {}}
          >
            <div
              className={classnames(
                styles['shortcut-table-row'],
                styles['shortcut-table-row-head']
              )}
            >
              <div className={styles['shortcut-table-col']}>功能</div>
              <div className={styles['shortcut-table-col']}>快捷键</div>
              <div className={styles['shortcut-table-col']}>全局快捷键</div>
            </div>
            {shorts.map(short => {
              return (
                <div className={styles['shortcut-table-row']} key={short.id}>
                  <div className={styles['shortcut-table-col']}>
                    {short.name}
                  </div>
                  <div className={styles['shortcut-table-col']}>
                    <div className={classnames(styles['keyboard-input'])}>
                      {short.shortcut}
                    </div>
                  </div>
                  <div className={styles['shortcut-table-col']}>
                    <div className={classnames(styles['keyboard-input'])}>
                      {short.shortcut}
                    </div>
                  </div>
                </div>
              )
            })}
            <button className={styles['restore-default-shortcut']}>
              恢复默认快捷键
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting
