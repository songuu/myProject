import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './en-US'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import * as types from '@root/store/action-types'

const lans = ['zh-CN', 'en-US', 'zh-TW']

const initLan = (language: types.languages) => {
  return i18next
}

const changeLocale = (locale: string) => {
  i18next.changeLanguage(locale)
}

(async () => {
  const lan = await window.Main.getLanguage()

  i18next.use(initReactI18next).init({
    lng: lans[lan] || 'zh-CN',
    fallbackLng: lans[lan] || 'zh-CN',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    resources: {
      'en-US': {
        translation: enUS,
      },
      'zh-CN': {
        translation: zhCN,
      },
      'zh-TW': {
        translation: zhTW,
      },
    },
  })
})()



export {
  initLan,
  changeLocale,
}

export default i18next