import * as types from '../action-types'
import { RootActions } from '../actions'

import shortcuts from '@root/constants/shortcuts'

import { list } from '@root/constants/categorylist'

const enabledPlaylistCategories = list.filter(c => c.enable).map(c => c.name)

export interface SettingsStateProps {
  enableGlobalShortcut: boolean
  shortcuts: types.ShortcutType[]
  enabledPlaylistCategories: string[]
  theme: types.Theme
}

const initialState: SettingsStateProps = {
  enableGlobalShortcut: true,
  shortcuts,
  enabledPlaylistCategories,
  theme: 'dark',
}

export default (
  state = initialState,
  action: RootActions
): SettingsStateProps => {
  switch (action.type) {
    case types.RESET_SHORTCUTS:
      return {
        ...state,
        shortcuts: shortcuts,
      }
    case types.SET_ENABLE_GLOBAL_SHORTCUT:
      return {
        ...state,
        enableGlobalShortcut: action.payload,
      }
    case types.UPDATE_SHORTCUT:
      return {
        ...state,
        shortcuts: state.shortcuts.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              ...action.payload,
            }
          }
          return item
        }),
      }
    case types.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      }
    default:
      return state
  }
}
