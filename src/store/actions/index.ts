import { Types } from '../action-types'
import { Dispatch } from 'react'
import { Action, AnyAction } from 'redux'

import {
  getEnableGlobalShortcut,
  changeEnableGlobalShortcut,
  getShortcuts,
  resetShortcuts,
  updateShortcut,
  setTheme
} from './settings'

import { setShowLogin } from './app'

import { updateApplycation } from './application'

import {
  setChatHistory,
  updateChatHistory,
  deleteChatHistory,
  setChatSetting,
  getChatSetting,
  getChatSessions,
  getChatSessionById,
  deleteChatSessionById,
  clearChatSessions,
  setChatSessions,
  getActiveChatSession,
  setActiveChatSession,
  updateChatSession,
  addChatSession,
  addChatSessionDataById,
  updateChatSessionDataById,
  deleteChatSessionDataMsgById,
  deleteChatSessionDataById,
  getChatSessionDataMsgByIdAndIndex,
  toggleUsingContext
} from './chat'

import {
  addApp
} from './buckets'

/** 自定义通用同步Action */
export interface CommonAction<T = any> {
  type: Types
  payload?: T
}

/** 自定义通用同步ActionCreator */
export interface CommonActionCreator<T = any> {
  (options?: T): CommonAction<T>
}

/** 自定义通用异步ActionCreator */
export interface CommonAsyncActionCreator<
  T = any,
  R = any,
  A extends Action = AnyAction
> {
  (options?: T): (dispatch: Dispatch<A>) => R
}
/** 应用Actions */
export type RootActions = any
/** 应用ActionCreator */
export interface RootActionsCreator {
  (): RootActions
}

export {
  getEnableGlobalShortcut,
  changeEnableGlobalShortcut,
  getShortcuts,
  resetShortcuts,
  updateShortcut,
  setShowLogin,
  updateApplycation,
  setTheme,
  setChatHistory,
  updateChatHistory,
  deleteChatHistory,
  getChatSetting,
  setChatSetting,
  getChatSessions,
  setChatSessions,
  clearChatSessions,
  getChatSessionById,
  deleteChatSessionById,
  updateChatSession,
  addChatSession,
  getActiveChatSession,
  setActiveChatSession,
  addChatSessionDataById,
  updateChatSessionDataById,
  deleteChatSessionDataMsgById,
  deleteChatSessionDataById,
  getChatSessionDataMsgByIdAndIndex,
  toggleUsingContext,
  addApp
}
