// * applycation
export const SET_APPLYCATIONS = 'SET_APPLYCATIONS'
export type SET_APPLYCATIONS_TYPE = typeof SET_APPLYCATIONS
export const UPDATE_APPLYCATIONS = 'UPDATE_APPLYCATIONS'
export type UPDATE_APPLYCATIONS_TYPE = typeof UPDATE_APPLYCATIONS

// * setting
export const RESET_SHORTCUTS = 'RESET_SHORTCUTS'
export type RESET_SHORTCUTS_TYPE = typeof RESET_SHORTCUTS
export const CHANGE_ENABLE_GLOBAL_SHORTCUT = 'CHANGE_ENABLE_GLOBAL_SHORTCUT'
export type CHANGE_ENABLE_GLOBAL_SHORTCUT_TYPE =
  typeof CHANGE_ENABLE_GLOBAL_SHORTCUT
export const UPDATE_SHORTCUT = 'UPDATE_SHORTCUT'
export type UPDATE_SHORTCUT_TYPE = typeof UPDATE_SHORTCUT

// * login
export const SHOW_LOGIN = 'SHOW_LOGIN'
export type SHOW_LOGIN_TYPE = typeof SHOW_LOGIN

export type ShortcutType = {
  id: string
  name: string
  shortcut: string
  globalShortcut: string
}

export type UpdatecutType = {
  id: string
  type: string
  shortcut: string
}

export enum Types {}
