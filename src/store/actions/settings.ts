import * as types from '../action-types'

export interface ResetShortcutsAction {
  type: types.RESET_SHORTCUTS_TYPE
}

export interface ChangeEnableGlobalShortcutAction {
  type: types.CHANGE_ENABLE_GLOBAL_SHORTCUT_TYPE
}

export interface UpdateShortcutAction {
  type: types.UPDATE_SHORTCUT_TYPE
  payload: types.UpdatecutType
}

export interface SetThemeAction {
  type: types.SET_THEME_TYPE
  payload: types.Theme
}

export const resetShortcuts = (): ResetShortcutsAction => ({
  type: types.RESET_SHORTCUTS,
})

export const changeEnableGlobalShortcut =
  (): ChangeEnableGlobalShortcutAction => ({
    type: types.CHANGE_ENABLE_GLOBAL_SHORTCUT,
  })

export const updateShortcut = (
  payload: types.UpdatecutType
): UpdateShortcutAction => ({
  type: types.UPDATE_SHORTCUT,
  payload,
})

export const setTheme = (payload: types.Theme): SetThemeAction => ({
  type: types.SET_THEME,
  payload,
})

export type SettingsActions =
  | ResetShortcutsAction
  | ChangeEnableGlobalShortcutAction
  | UpdateShortcutAction
  | SetThemeAction
