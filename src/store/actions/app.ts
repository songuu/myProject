import * as types from '../action-types'

export interface SetShowLoginAction {
  type: types.SHOW_LOGIN_TYPE
}

export const setShowLogin = (): SetShowLoginAction => ({
  type: types.SHOW_LOGIN,
})

export type AppActions =
  | SetShowLoginAction
