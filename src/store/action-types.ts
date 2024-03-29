import { OssType } from '@constants/enums'

// * applycation
export const SET_APPLYCATIONS = 'SET_APPLYCATIONS'
export type SET_APPLYCATIONS_TYPE = typeof SET_APPLYCATIONS
export const UPDATE_APPLYCATIONS = 'UPDATE_APPLYCATIONS'
export type UPDATE_APPLYCATIONS_TYPE = typeof UPDATE_APPLYCATIONS

// * setting
export const GET_SHORTCUT_TYPE = 'GET_SHORTCUT_TYPE'
export type GET_SHORTCUT_TYPE_TYPE = typeof GET_SHORTCUT_TYPE
export const SET_SHORTCUTS = 'SET_SHORTCUTS'
export type SET_SHORTCUTS_TYPE = typeof SET_SHORTCUTS
export const RESET_SHORTCUTS = 'RESET_SHORTCUTS'
export type RESET_SHORTCUTS_TYPE = typeof RESET_SHORTCUTS
export const SET_ENABLE_GLOBAL_SHORTCUT = 'SET_ENABLE_GLOBAL_SHORTCUT'
export type SET_ENABLE_GLOBAL_SHORTCUT_TYPE = typeof SET_ENABLE_GLOBAL_SHORTCUT
export const UPDATE_SHORTCUT = 'UPDATE_SHORTCUT'
export type UPDATE_SHORTCUT_TYPE = typeof UPDATE_SHORTCUT
export const SET_THEME = 'SET_THEME'
export type SET_THEME_TYPE = typeof SET_THEME
export const SET_LANGUAGE = 'SET_LANGUAGE'
export type SET_LANGUAGE_TYPE = typeof SET_LANGUAGE

// * login
export const SHOW_LOGIN = 'SHOW_LOGIN'
export type SHOW_LOGIN_TYPE = typeof SHOW_LOGIN

// * chat
export const SET_CHAT_HISTORY = 'SET_CHAT_HISTORY'
export type SET_CHAT_HISTORY_TYPE = typeof SET_CHAT_HISTORY
export const UPDATE_CHAT_HISTORY = 'UPDATE_CHAT_HISTORY'
export type UPDATE_CHAT_HISTORY_TYPE = typeof UPDATE_CHAT_HISTORY
export const DELETE_CHAT_HISTORY = 'DELETE_CHAT_HISTORY'
export type DELETE_CHAT_HISTORY_TYPE = typeof DELETE_CHAT_HISTORY
export const SET_CHAT_SETTING = 'SET_CHAT_SETTING'
export type SET_CHAT_SETTING_TYPE = typeof SET_CHAT_SETTING
export const SET_ACTIVE_SESSION = 'SET_ACTIVE_SESSION'
export type SET_ACTIVE_SESSION_TYPE = typeof SET_ACTIVE_SESSION
export const SET_SESSIONS = 'SET_SESSIONS'
export type SET_SESSIONS_TYPE = typeof SET_SESSIONS
export const SET_SESSION = 'SET_SESSION'
export type SET_SESSION_TYPE = typeof SET_SESSION
export const SET_USING_CONTEXT = 'SET_USING_CONTEXT'
export type SET_USING_CONTEXT_TYPE = typeof SET_USING_CONTEXT

// * prompt
export const SET_PROMPT_LIST = 'SET_PROMPT_LIST'
export type SET_PROMPT_LIST_TYPE = typeof SET_PROMPT_LIST

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

export type ChatSettingType = {
  apiKey: string
  apiURL: string
  systemMessage: string
}

export type Theme = 'light' | 'dark' | 'auto'

export enum languages {
  'zh-CN',
  'en-US',
  'zh-TW'
}

export type ChatHistoryType = {
  id: string
}

export type UpdateHistoryType = {}

export type DeleteHistoryType = {}

export enum Types { }

export type FormType = {
  name: string
  type: OssType
  ak: string
  sk: string
}