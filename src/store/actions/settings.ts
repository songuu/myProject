import * as types from '../action-types'

import { AppDispatch } from '../index'
export interface ResetShortcutsAction {
  type: types.RESET_SHORTCUTS_TYPE
}

export interface UpdateShortcutAction {
  type: types.UPDATE_SHORTCUT_TYPE
  payload: types.UpdatecutType
}

export interface SetThemeAction {
  type: types.SET_THEME_TYPE
  payload: types.Theme
}

export const getShortcuts = () => {
  return async (dispatch: AppDispatch) => {
    const shortcuts = await window.Main.getShortcuts()
    dispatch({
      type: types.SET_SHORTCUTS,
      payload: shortcuts,
    })
  }
}

export const resetShortcuts = () => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.restoreDefaultShortcuts()
    if (r) {
      const shortcuts = await window.Main.getShortcuts()

      dispatch({
        type: types.RESET_SHORTCUTS,
      })

      dispatch({
        type: types.SET_SHORTCUTS,
        payload: shortcuts,
      })
    }
  }
}

export const getEnableGlobalShortcut = () => {
  return async (dispatch: AppDispatch) => {
    const enableGlobalShortcut = await window.Main.getEnableGlobalShortcut()
    dispatch({
      type: types.SET_ENABLE_GLOBAL_SHORTCUT,
      payload: enableGlobalShortcut,
    })
  }
}

export const changeEnableGlobalShortcut = (payload: boolean) => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.switchGlobalShortcutStatusTemporary(payload)
    if (r) {
      const enableGlobalShortcut = await window.Main.getEnableGlobalShortcut()
      dispatch({
        type: types.SET_ENABLE_GLOBAL_SHORTCUT,
        payload: enableGlobalShortcut,
      })
    }
  }
}

export const updateShortcut = (payload: types.UpdatecutType) => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.updateShortcut(payload)
    if (r) {
      const shortcuts = await window.Main.getShortcuts()

      dispatch({
        type: types.UPDATE_SHORTCUT,
        payload,
      })

      dispatch({
        type: types.SET_SHORTCUTS,
        payload: shortcuts,
      })
    }
  }
}

export const setTheme = (payload: types.Theme): SetThemeAction => ({
  type: types.SET_THEME,
  payload,
})

export type SettingsActions =
  | ResetShortcutsAction
  | UpdateShortcutAction
  | SetThemeAction
