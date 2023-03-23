import * as types from '../action-types'

import { AppDispatch } from '../index'

export const addApp = (app: types.FormType) => {
  return async (dispatch: AppDispatch) => {
    await window.Main.addApp(app)

    const apps = await window.Main.getApps()

    dispatch({
      type: types.SET_ALL_APPS,
      payload: apps,
    })
  }
}

export const getBuckets = (config?: {
  type: types.OssType
  ak: string
  sk: string
}) => {
  return async (dispatch: AppDispatch) => {
    const buckets = await window.Main.getBuckets(config)
    dispatch({
      type: types.SET_BUCKETS,
      payload: buckets,
    })
  }
}

export const getApps = () => {
  return async (dispatch: AppDispatch) => {
    const apps = await window.Main.getApps()
    dispatch({
      type: types.SET_ALL_APPS,
      payload: apps,
    })
  }
}
