import * as types from '../action-types'

export interface AddChatHistoryAction {
  type: types.SET_CHAT_HISTORY_TYPE
}

export interface UpdateChatHistoryAction {
  type: types.UPDATE_CHAT_HISTORY_TYPE
  payload: types.UpdateHistoryType
}

export interface DeleteChatHistoryAction {
  type: types.DELETE_CHAT_HISTORY_TYPE
  payload: types.DeleteHistoryType
}

export const addChatHistory = (): AddChatHistoryAction => ({
  type: types.SET_CHAT_HISTORY,
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

export type SettingsActions =
  | AddChatHistoryAction
  | UpdateChatHistoryAction
  | DeleteChatHistoryAction
