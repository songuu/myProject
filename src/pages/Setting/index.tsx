import React, { useState } from 'react'

import { SvgIcon } from '@components/index'

import classnames from 'classnames'

import styles from './index.module.less'

import defaultAvatar from '@imgs/default-avatar.png'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { ShortcutType } from '@root/store/reducer/settings'

import { changeEnableGlobalShortcut } from '@root/store/actions'

const Setting = () => {
  const dispatch = useAppDispatch()
  const shortcuts = useAppSelector(state => state.settings.shortcuts)

  const enableGlobalShortcut = useAppSelector(
    state => state.settings.enableGlobalShortcut
  )

  const [shortcutInput, setShortcutInput] = useState({
    id: '',
    type: '',
    recording: false,
  })

  const [recordedShortcut, setRecordedShortcut] = useState([])

  const handleToggle = () => {
    dispatch(changeEnableGlobalShortcut())
  }

  const readyToRecordShortcut = (id: string, type: string) => {
    if (type === 'globalShortcut' && !enableGlobalShortcut) {
      return
    }

    setShortcutInput({
      id,
      type,
      recording: true,
    })
  }

  const formatShortcut = (shortcut: any) => {
    shortcut = shortcut
      .replaceAll('+', ' + ')
      .replace('Up', '↑')
      .replace('Down', '↓')
      .replace('Right', '→')
      .replace('Left', '←')
    /* if (process.platform === 'darwin') {
      return shortcut
        .replace('CommandOrControl', '⌘')
        .replace('Command', '⌘')
        .replace('Alt', '⌥')
        .replace('Control', '⌃')
        .replace('Shift', '⇧')
    } */
    return shortcut.replace('CommandOrControl', 'Ctrl')
  }

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
                  checked={enableGlobalShortcut}
                  id="enable-enable-global-shortcut"
                  type="checkbox"
                  name="enable-enable-global-shortcut"
                  onChange={handleToggle}
                />
                <label htmlFor="enable-enable-global-shortcut"></label>
              </div>
            </div>
          </div>
          <div
            id="shortcut-table"
            className={classnames(
              styles['shortcut-table'],
              !enableGlobalShortcut ? styles['shortcut-table-enable'] : ''
            )}
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
            {shortcuts.map((shortcut: ShortcutType) => {
              return (
                <div className={styles['shortcut-table-row']} key={shortcut.id}>
                  <div className={styles['shortcut-table-col']}>
                    {shortcut.name}
                  </div>
                  <div className={styles['shortcut-table-col']}>
                    <div
                      onClick={() =>
                        readyToRecordShortcut(shortcut.id, 'shortcut')
                      }
                      className={classnames(
                        styles['keyboard-input'],
                        shortcutInput.id === shortcut.id &&
                          shortcutInput.type === 'shortcut'
                          ? styles['keyboard-input-active']
                          : ''
                      )}
                    >
                      {shortcutInput.id === shortcut.id &&
                      shortcutInput.type === 'shortcut'
                        ? formatShortcut(shortcut.shortcut)
                        : formatShortcut(shortcut.shortcut)}
                    </div>
                  </div>
                  <div className={styles['shortcut-table-col']}>
                    <div className={classnames(styles['keyboard-input'])}>
                      {shortcut.shortcut}
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
