import * as types from '../action-types'

export interface AddChatHistoryAction {
  type: types.SET_CHAT_HISTORY_TYPE
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
  type: types.SET_CHAT_SETTING_TYPE
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

export const setChatSetting = (payload: types.ChatSettingType) => {
  return async (dispatch: any) => {
    const r = await window.Main.setChatSetting(payload)
    if (r) {
      dispatch({
        type: types.SET_CHAT_SETTING,
        payload,
      })
    }
  }
}

export const getChatSetting = () => {
  return async (dispatch: any) => {
    const setting = await window.Main.getChatSetting()
    if (setting) {
      dispatch({
        type: types.SET_CHAT_SETTING,
        payload: setting,
      })
    }
  }
}

export const getChatSessions = () => {
  return async (dispatch: any) => {
    const sessions = await window.Main.getChatSessions()
    if (sessions) {
      dispatch({
        type: types.SET_SESSIONS,
        payload: sessions,
      })
    }
  }
}

export const setChatSessions = (data: any) => {
  return (dispatch: any) => {
    dispatch({
      type: types.SET_SESSIONS,
      payload: data,
    })
  }
}

export const getChatSession = (id: string) => {
  return async (dispatch: any) => {
    const session = await window.Main.getChatSession(id)
    if (session) {
      dispatch({
        type: types.SET_SESSION,
        payload: session,
      })
    }
  }
}

export const deleteChatSession = (id: string) => {
  return async (dispatch: any) => {
    const r = await window.Main.deleteChatSession(id)
    if (r) {
      const sessions = await window.Main.getChatSessions()
      const activeSession = await window.Main.getActiveChatSession()
      dispatch({
        type: types.SET_SESSIONS,
        payload: sessions,
      })
      dispatch({
        type: types.SET_ACTIVE_SESSION,
        payload: activeSession,
      })
      dispatch({
        type: types.SET_SESSION,
        payload: sessions[0]?.data || [],
      })
    }
  }
}

export const addChatSession = (data: any) => {
  return async (dispatch: any) => {
    const r = await window.Main.addChatSession(data)
    if (r) {
      const sessions = await window.Main.getChatSessions()
      dispatch({
        type: types.SET_SESSIONS,
        payload: sessions,
      })
      dispatch({
        type: types.SET_ACTIVE_SESSION,
        payload: data.id,
      })
    }
  }
}

export const clearChatSessions = () => {
  return async (dispatch: any) => {
    const r = await window.Main.clearChatSessions()
    if (r) {
      dispatch({
        type: types.SET_SESSIONS,
        payload: [],
      })
      dispatch({
        type: types.SET_ACTIVE_SESSION,
        payload: '',
      })
      dispatch({
        type: types.SET_SESSION,
        payload: [],
      })
    }
  }
}

export const updateChatSession = (data: any) => {
  return async (dispatch: any) => {
    const r = await window.Main.updateChatSession(data)
    if (r) {
      const sessions = await window.Main.getChatSessions()
      dispatch({
        type: types.SET_SESSIONS,
        payload: sessions,
      })
    }
  }
}

export const setActiveChatSession = (id: string) => {
  return async (dispatch: any) => {
    const r = await window.Main.setActiveChatSession(id)

    if (r) {
      dispatch({
        type: types.SET_ACTIVE_SESSION,
        payload: id,
      })
    }
  }
}

export const getActiveChatSession = () => {
  return async (dispatch: any) => {
    const session = await window.Main.getActiveChatSession()
    if (session) {
      dispatch({
        type: types.SET_ACTIVE_SESSION,
        payload: session,
      })
    }
  }
}

export const addChatSessionDataById = (data: any) => {
  return async (dispatch: any) => {
    const r = await window.Main.addChatSessionDataById(data)
    if (r) {
      const sessions = await window.Main.getChatSessions()
      const actionId = await window.Main.getActiveChatSession()
      const session = await window.Main.getChatSession(data.id)
      dispatch({
        type: types.SET_SESSIONS,
        payload: sessions,
      })
      dispatch({
        type: types.SET_SESSION,
        payload: session,
      })
      dispatch({
        type: types.SET_ACTIVE_SESSION,
        payload: actionId,
      })
    }
  }
}

export const updateChatSessionDataById = (data: any) => {
  return async (dispatch: any) => {
    const r = await window.Main.updateChatSessionDataById(data)
    if (r) {
      const sessions = await window.Main.getChatSessions()
      const session = await window.Main.getChatSession(data.id)

      dispatch({
        type: types.SET_SESSIONS,
        payload: sessions,
      })

      dispatch({
        type: types.SET_SESSION,
        payload: session,
      })
    }
  }
}

export const deleteChatSessionDataById = (data: any) => {
  return async (dispatch: any) => {
    const r = await window.Main.deleteChatSessionDataById(data)
    if (r) {
      const sessions = await window.Main.getChatSessions()
      const session = await window.Main.getChatSession(data.id)

      dispatch({
        type: types.SET_SESSIONS,
        payload: sessions,
      })

      dispatch({
        type: types.SET_SESSION,
        payload: session,
      })
    }
  }
}

export const deleteChatSessionById = (id: string) => {
  return async (dispatch: any) => {
    const r = await window.Main.deleteChatSessionById(id)
    if (r) {
      const sessions = await window.Main.getChatSessions()
      const session = await window.Main.getChatSession(id)

      dispatch({
        type: types.SET_SESSIONS,
        payload: sessions,
      })

      dispatch({
        type: types.SET_SESSION,
        payload: session,
      })
    }
  }
}

export type SettingsActions =
  | AddChatHistoryAction
  | UpdateChatHistoryAction
  | DeleteChatHistoryAction
  | SetChatSettingAction
