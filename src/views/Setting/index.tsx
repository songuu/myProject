import React, { useEffect, useState, useRef } from 'react'

import { ButtonIcon, Icon } from '@components/index'

import classnames from 'classnames'

import { Typography } from '@arco-design/web-react'

const { Title } = Typography

import defaultAvatar from '@imgs/default-avatar.png'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { ShortcutType, Theme } from '@root/store/action-types'

import {
  changeEnableGlobalShortcut,
  getEnableGlobalShortcut,
  getShortcuts,
  resetShortcuts,
  updateShortcut,
  setTheme,
} from '@root/store/actions'

import { Switch } from '@components/index'

import pkg from '../../../package.json'

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

const themeOptions: { label: string; theme: Theme; icon: string }[] = [
  {
    label: 'Light',
    theme: 'light',
    icon: 'icon-sun',
  },
  {
    label: 'Dark',
    theme: 'dark',
    icon: 'icon-dark',
  },
  {
    label: 'Auto',
    theme: 'auto',
    icon: 'icon-wbauto',
  },
]

const shortcutTableCol =
  'min-w-[192px] p-[8px] flex items-center first:pl-0 first:min-w-[128px] dark:text-white'

const keyboardInput =
  'font-semibold bg-[#f5f5f7] rounded-[8px] px-[12px] py-[8px] min-w-[146px] min-h-[34px] box-border dark:text-black'

const keyboardInputActive = 'text-[#335eea] bg-[#eaeffd]'

const Setting = () => {
  const dispatch = useAppDispatch()

  const shortcuts = useAppSelector(
    state => state.settings.shortcuts
  ) as ShortcutType[]

  const enableGlobalShortcut = useAppSelector(
    state => state.settings.enableGlobalShortcut
  ) as boolean

  const theme = useAppSelector(state => state.settings.theme)

  const [shortcutInput, setShortcutInput] = useState({
    id: '',
    type: '',
    recording: false,
  })

  const [recordedShortcut, setRecordedShortcut] = useState<KeyItem[]>([])

  const [recordedShortcutComputed, setRecordedShortcutComputed] =
    useState<string>('')

  const recordedShortcutComputedRef = useRef<string>('')

  useEffect(() => {
    if (!recordedShortcut.length) {
      return
    }
    let shortcut: any = []

    // eslint-disable-next-line array-callback-return
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

    /*
     * 首先快捷键的设置需要考虑主要的功能键和其他的键
     * 功能键的设置的优先级更高
     */
    const sortTable: any = {
      Control: 1,
      Shift: 2,
      Alt: 3,
      Command: 4,
    }

    shortcut = shortcut.sort((a: string, b: number) => {
      if (!sortTable[a] || !sortTable[b]) return -1
      if (sortTable[a] - sortTable[b] <= -1) {
        return -1
      } else if (sortTable[a] - sortTable[b] >= 1) {
        return 1
      } else {
        return 0
      }
    })

    shortcut = shortcut.join('+')

    setRecordedShortcutComputed(shortcut)

    recordedShortcutComputedRef.current = shortcut
  }, [recordedShortcut])

  const initState = async () => {
    dispatch(getShortcuts())
    dispatch(getEnableGlobalShortcut())
  }

  useEffect(() => {
    initState().then(r => r)
  }, [])

  const handleToggle = () => {
    dispatch(changeEnableGlobalShortcut(!enableGlobalShortcut))
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

    // dispatch(changeEnableGlobalShortcut(false))
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
    return shortcut
      .replace('CommandOrControl', 'Ctrl')
      .replace('Control', 'Ctrl')
  }

  const saveShortcut = async () => {
    const { id, type } = shortcutInput

    const payload = {
      id,
      type,
      shortcut: recordedShortcutComputedRef.current.replace(
        'Control',
        'CommandOrControl'
      ),
    }

    await dispatch(updateShortcut(payload))

    setRecordedShortcutComputed('')
    recordedShortcutComputedRef.current = ''
    setRecordedShortcut([])
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

    setTimeout(() => {
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
    }, 0)
  }

  const handleShortcutKeyup = (e: React.KeyboardEvent) => {
    /* if (recordedShortcut.find((item: KeyItem) => item.keyCode === e.keyCode)) {
      setRecordedShortcut(
        recordedShortcut.filter((item: KeyItem) => item.keyCode !== e.keyCode)
      )
    } */
  }

  const restoreDefaultShortcuts = () => {
    dispatch(resetShortcuts())
  }

  const clickOutside = () => {
    if (!shortcutInput.recording) return

    setShortcutInput({
      id: '',
      type: '',
      recording: false,
    })

    setRecordedShortcut([])

    // dispatch(changeEnableGlobalShortcut(true))
  }

  return (
    <div className="flex" onClick={clickOutside}>
      <div className="mt-[24px] mb-[64px] w-full">
        <Title heading={4}>版本 - {pkg.version}</Title>
        <div className="mt-[24px] flex items-center justify-between rounded-[16px] bg-[#eaeffd] px-[20px] py-[16px] text-[#000]">
          <div className="flex items-center">
            <img
              className="h-[64px] w-[64px] rounded-full"
              src={defaultAvatar}
            />
            <div className="ml-[24px]">
              <div className="mb-[2px] text-[20px] font-semibold">user</div>
              <div>12</div>
            </div>
          </div>
          <div>
            <button className="mx-[12px] flex items-center px-[12px] py-[8px] text-lg text-black opacity-60 duration-200 hover:bg-[#eaeffd] hover:text-[#335eea] hover:opacity-100 active:scale-95 active:opacity-100 active:duration-200">
              <Icon
                type="icon-sign-out-alt"
                className="mr-[4px] h-[18px] w-[18px]"
              />
              <span>登出</span>
            </button>
          </div>
        </div>
        <div className="mt-[24px]">
          <Title heading={6}>快捷键</Title>
          <div className="my-[24px] flex items-center justify-between text-black">
            <div className="text-lg font-medium dark:text-white">
              启用全局快捷键
            </div>
            <div>
              <Switch checked={enableGlobalShortcut} onChange={handleToggle} />
            </div>
          </div>
          <div
            id="shortcut-table"
            className="select-none text-black focus:outline-none"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => handleShortcutKeydown(e)}
            onKeyUp={(e: React.KeyboardEvent) => handleShortcutKeyup(e)}
          >
            <div
              className={`opcaity-60 flex text-sm font-medium ${
                !enableGlobalShortcut && 'last:opacity-50'
              }`}
            >
              <div className={shortcutTableCol}>功能</div>
              <div className={shortcutTableCol}>快捷键</div>
              <div className={shortcutTableCol}>全局快捷键</div>
            </div>
            {shortcuts.map((shortcut: ShortcutType) => {
              return (
                <div
                  className={`flex ${
                    !enableGlobalShortcut && 'last:opacity-100'
                  }`}
                  key={shortcut.id}
                >
                  <div className={shortcutTableCol}>{shortcut.name}</div>
                  <div className={shortcutTableCol}>
                    <div
                      onClick={() =>
                        readyToRecordShortcut(shortcut.id, 'shortcut')
                      }
                      className={classnames(
                        keyboardInput,
                        shortcutInput.id === shortcut.id &&
                          shortcutInput.type === 'shortcut'
                          ? keyboardInputActive
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
                  <div className={shortcutTableCol}>
                    <div
                      onClick={() =>
                        readyToRecordShortcut(shortcut.id, 'globalShortcut')
                      }
                      className={classnames(
                        keyboardInput,
                        shortcutInput.id === shortcut.id &&
                          shortcutInput.type === 'globalShortcut' &&
                          enableGlobalShortcut
                          ? keyboardInputActive
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
              className="mt-[12px] rounded-[8px] bg-gray-100 px-[12px] py-[8px] font-semibold text-black duration-200 hover:scale-105  active:scale-95"
              onClick={restoreDefaultShortcuts}
            >
              恢复默认快捷键
            </button>
          </div>
        </div>
        <div className="mt-[24px]">
          <Title heading={6}>其他</Title>
          <div className="flex items-center space-x-4">
            <span className="w-[40px] flex-shrink-0">主题</span>
            <div className="flex flex-wrap items-center gap-4">
              {themeOptions.map((item: any) => {
                return (
                  <ButtonIcon
                    onclick={() => {
                      dispatch(setTheme(item.theme))
                    }}
                  >
                    <Icon
                      type={item.icon}
                      className={`h-4 w-4 ${
                        item.theme === theme ? 'text-blue-600' : ''
                      }`}
                    />
                  </ButtonIcon>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting
