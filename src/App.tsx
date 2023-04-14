import React, { Suspense, useEffect, useMemo } from 'react'

import { I18nextProvider } from 'react-i18next'

import { ConfigProvider } from '@arco-design/web-react'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { getTheme, getLanguage } from '@root/store/actions'

import * as types from '@root/store/action-types'

import Router from '@router/index'

import { AppLoading } from '@components/index'

import i18, { changeLocale } from './locales'

import enUS from '@arco-design/web-react/es/locale/en-US'
import zhCN from '@arco-design/web-react/es/locale/zh-CN'
import zhTW from '@arco-design/web-react/es/locale/zh-TW'

interface IAppProps {}

const App: React.FC<IAppProps> = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(state => state.settings.theme)
  const language = useAppSelector(state => state.settings.language)

  useEffect(() => {
    switch (theme) {
      case 'light':
        document.documentElement.classList.remove('dark')
        document.body.removeAttribute('arco-theme')
        break
      case 'dark':
        document.documentElement.classList.add('dark')
        document.body.setAttribute('arco-theme', 'dark')
        break
      case 'auto':
      default:
        document.documentElement.classList.toggle(
          'dark',
          window.matchMedia('(prefers-color-scheme: dark)').matches
        )
        break
    }
  }, [theme])

  const local = useMemo(() => {
    switch (language) {
      case types.languages['zh-TW']:
        // changeLocale('zh-TW')
        return zhTW
      case types.languages['en-US']:
        // changeLocale('en-US')
        return enUS
      case types.languages['zh-CN']:
      default:
        // changeLocale('zh-CN')
        return zhCN
    }
  }, [language])

  useEffect(() => {
    Promise.all([dispatch(getLanguage()), dispatch(getTheme())])
  }, [])

  return (
    <I18nextProvider i18n={i18}>
      <ConfigProvider
        locale={local}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <div className="h-[100vh]">
          <Suspense fallback={<AppLoading />}>
            <Router />
          </Suspense>
        </div>
      </ConfigProvider>
    </I18nextProvider>
  )
}

export default App
