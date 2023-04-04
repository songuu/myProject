import * as types from '../action-types'

import { AppDispatch } from '../index'

export const getPromptList = () => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.getPromptList()
    if (r) {
      dispatch({
        type: types.SET_PROMPT_LIST,
        payload: r,
      })
    }
  }
}

export const addPrompt = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.addPrompt(payload)
    if (r) {
      const ll = await window.Main.getPromptList()
      dispatch({
        type: types.SET_PROMPT_LIST,
        payload: ll,
      })
    }
  }
}

export const updatePrompt = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.updatePrompt(payload)
    if (r) {
      const ll = await window.Main.getPromptList()
      dispatch({
        type: types.SET_PROMPT_LIST,
        payload: ll,
      })
    }
  }
}

export const deletePrompt = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.deletePrompt(payload)
    if (r) {
      const ll = await window.Main.getPromptList()
      dispatch({
        type: types.SET_PROMPT_LIST,
        payload: ll,
      })
    }
  }
}

export const setPromptList = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    const r = await window.Main.setPromptList(payload)

    if (r) {
      const ll = await window.Main.getPromptList()
      dispatch({
        type: types.SET_PROMPT_LIST,
        payload: ll,
      })
    }
  }
}