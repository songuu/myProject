import * as types from '../action-types'
import { RootActions } from '../actions'

export interface AppStateProps {
  showLogin: boolean
}

const initialState: AppStateProps = {
  showLogin: false,
}

export default (
  state = initialState,
  action: RootActions
): AppStateProps => {
  switch (action.type) {
    case types.SHOW_LOGIN:
      return {
        ...state,
        showLogin: !state.showLogin,
      }
    default:
      return state
  }
}
