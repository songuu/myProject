import * as types from '../action-types'

export interface AddChatHistoryAction {
  type: types.SET_CHAT_HISTORY_TYPE,
  payload: types.ChatHistoryType[]
}

export interface UpdateChatHistoryAction {
  type: types.UPDATE_CHAT_HISTORY_TYPE
  payload: types.UpdateHistoryType
}

export interface DeleteChatHistoryAction {
  type: types.DELETE_CHAT_HISTORY_TYPE
  payload: types.DeleteHistoryType
}

export interface SetChatSettingAction {
  type: types.SET_CHAT_SETTING_TYPE,
  payload: types.ChatSettingType
}

export const setChatHistory = (
  payload: types.ChatHistoryType[]
): AddChatHistoryAction => ({
  type: types.SET_CHAT_HISTORY,
  payload,
})

export const updateChatHistory = (
  payload: types.UpdateHistoryType
): UpdateChatHistoryAction => ({
  type: types.UPDATE_CHAT_HISTORY,
  payload,
})

export const deleteChatHistory = (
  payload: types.DeleteHistoryType
): DeleteChatHistoryAction => ({
  type: types.DELETE_CHAT_HISTORY,
  payload,
})

export const setChatSetting = (
  payload: types.ChatSettingType
): SetChatSettingAction => ({
  type: types.SET_CHAT_SETTING,
  payload,
})

export type SettingsActions =
  | AddChatHistoryAction
  | UpdateChatHistoryAction
  | DeleteChatHistoryAction
  | SetChatSettingAction
