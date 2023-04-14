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

export interface SetLanguageAction {
  type: types.SET_LANGUAGE_TYPE
  payload: types.languages
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

export const setTheme = (payload: types.Theme) => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.setTheme(payload)
    if (r) {
      dispatch({
        type: types.SET_THEME,
        payload,
      })
    }
  }
}

export const setLanguage = (payload: types.languages) => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.setLanguage(payload)
    if (r) {
      dispatch({
        type: types.SET_LANGUAGE,
        payload,
      })
    }
  }
}

export const getTheme = () => {
  return async (dispatch: AppDispatch) => {
    const theme = await window.Main.getTheme()
    dispatch({
      type: types.SET_THEME,
      payload: theme,
    })
  }
}

export const getLanguage = () => {
  return async (dispatch: AppDispatch) => {
    const language = await window.Main.getLanguage()
    dispatch({
      type: types.SET_LANGUAGE,
      payload: language,
    })
  }
}

export type SettingsActions =
  | ResetShortcutsAction
  | UpdateShortcutAction
