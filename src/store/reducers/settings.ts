import * as types from '../action-types'
import { RootActions } from '../actions'

import shortcuts from '@root/constants/shortcuts'

import { list } from '@root/constants/categorylist'

const enabledPlaylistCategories = list.filter(c => c.enable).map(c => c.name)

export interface SettingsStateProps {
  enableGlobalShortcut: boolean
  shortcuts: types.ShortcutType[]
  enabledPlaylistCategories: string[]
}

const initialState: SettingsStateProps = {
  enableGlobalShortcut: true,
  shortcuts: shortcuts,
  enabledPlaylistCategories,
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
    case types.CHANGE_ENABLE_GLOBAL_SHORTCUT:
      return {
        ...state,
        enableGlobalShortcut: !state.enableGlobalShortcut,
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
    default:
      return state
  }
}
