import React, { useEffect, useState } from 'react'

import { SvgIcon } from '@components/index'

import classnames from 'classnames'

import styles from './index.module.less'

import defaultAvatar from '@imgs/default-avatar.png'

import { useAppSelector, useAppDispatch } from '@root/store/index'

// @ts-ignore
import { ShortcutType } from '@root/store/reducer/settings'

import {
  changeEnableGlobalShortcut,
  resetShortcuts,
  updateShortcut,
} from '@root/store/actions'

const validShortcutCodes: string[] = [
  '=',
  '-',
  '~',
  '[',
  ']',
  ';',
  "'",
  ',',
  '.',
  '/',
]

type KeyItem = {
  key: string
  keyCode: number
  code: string
}

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

  const [recordedShortcut, setRecordedShortcut] = useState<KeyItem[]>([])

  const [recordedShortcutComputed, setRecordedShortcutComputed] =
    useState<string>('')

  useEffect(() => {
    let shortcut: any = []

    recordedShortcut.map((e: KeyItem) => {
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        // A-Z
        shortcut.push(e.code.replace('Key', ''))
      } else if (e.key === 'Meta') {
        // ⌘ Command on macOS
        shortcut.push('Command')
      } else if (['Alt', 'Control', 'Shift'].includes(e.key)) {
        shortcut.push(e.key)
      } else if (e.keyCode >= 48 && e.keyCode <= 57) {
        // 0-9
        shortcut.push(e.code.replace('Digit', ''))
      } else if (e.keyCode >= 112 && e.keyCode <= 123) {
        // F1-F12
        shortcut.push(e.code)
      } else if (
        ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)
      ) {
        // Arrows
        shortcut.push(e.code.replace('Arrow', ''))
      } else if (validShortcutCodes.includes(e.key)) {
        shortcut.push(e.key)
      }
    })

    const sortTable: any = {
      Control: 1,
      Shift: 2,
      Alt: 3,
      Command: 4,
    }
    shortcut = shortcut.sort((a: string, b: number) => {
      if (!sortTable[a] || !sortTable[b]) return 0
      if (sortTable[a] - sortTable[b] <= -1) {
        return -1
      } else if (sortTable[a] - sortTable[b] >= 1) {
        return 1
      } else {
        return 0
      }
    })

    shortcut = shortcut.join('+')

    console.log(shortcut)

    setRecordedShortcutComputed(shortcut)
  }, [recordedShortcut])

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

    setRecordedShortcut([])
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

  const saveShortcut = () => {
    const { id, type } = shortcutInput

    const payload = {
      id,
      type,
      shortcut: recordedShortcutComputed,
    }

    dispatch(updateShortcut(payload))

    setTimeout(() => {
      setRecordedShortcut([])
    }, 500)
  }

  const handleShortcutKeydown = (e: React.KeyboardEvent) => {
    if (!shortcutInput.recording) return

    e.preventDefault()

    if (recordedShortcut.find((item: KeyItem) => item.keyCode === e.keyCode))
      return

    const keyItem: KeyItem = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
    }
    setRecordedShortcut([keyItem, ...recordedShortcut])

    if (
      (e.keyCode >= 65 && e.keyCode <= 90) || // A-Z
      (e.keyCode >= 48 && e.keyCode <= 57) || // 0-9
      (e.keyCode >= 112 && e.keyCode <= 123) || // F1-F12
      ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key) || // Arrows
      validShortcutCodes.includes(e.key)
    ) {
      // 保存
      saveShortcut()
    }
  }

  const handleShortcutKeyup = (e: React.KeyboardEvent) => {
    /* if (recordedShortcut.find((item: KeyItem) => item.keyCode === e.keyCode)) {
      setRecordedShortcut(
        recordedShortcut.filter((item: KeyItem) => item.keyCode !== e.keyCode)
      )
    } */
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
            onKeyDown={(e: React.KeyboardEvent) => handleShortcutKeydown(e)}
            onKeyUp={(e: React.KeyboardEvent) => handleShortcutKeyup(e)}
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
                      shortcutInput.type === 'shortcut' &&
                      recordedShortcutComputed !== ''
                        ? formatShortcut(recordedShortcutComputed)
                        : formatShortcut(shortcut.shortcut)}
                    </div>
                  </div>
                  <div className={styles['shortcut-table-col']}>
                    <div
                      onClick={() =>
                        readyToRecordShortcut(shortcut.id, 'globalShortcut')
                      }
                      className={classnames(
                        styles['keyboard-input'],
                        shortcutInput.id === shortcut.id &&
                          shortcutInput.type === 'globalShortcut' &&
                          enableGlobalShortcut
                          ? styles['keyboard-input-active']
                          : ''
                      )}
                    >
                      {shortcutInput.id === shortcut.id &&
                      shortcutInput.type === 'globalShortcut' &&
                      recordedShortcutComputed !== ''
                        ? formatShortcut(recordedShortcutComputed)
                        : formatShortcut(shortcut.globalShortcut)}
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              className={styles['restore-default-shortcut']}
              onClick={() => {
                dispatch(resetShortcuts())
              }}
            >
              恢复默认快捷键
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting
