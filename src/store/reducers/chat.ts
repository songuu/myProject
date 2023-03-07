import * as types from '../action-types'
import { RootActions } from '../actions'

export interface ChatsStateProps {
  history: types.ChatHistoryType
  historys: types.ChatHistoryType[]
}

const initialState: ChatsStateProps = {
  history: {},
  historys: [],
}

export default (state = initialState, action: RootActions): ChatsStateProps => {
  switch (action.type) {
    case types.SET_CHAT_HISTORY:
      return {
        ...state,
        history: history,
      }
    case types.UPDATE_CHAT_HISTORY:
      return {
        ...state,
        historys: state.historys.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              ...action.payload,
            }
          }
          return item
        }),
      }
    case types.DELETE_CHAT_HISTORY:
      return {
        ...state,
        historys: state.historys.filter(item => {
          return item.id !== action.payload.id
        }),
      }
    default:
      return state
  }
}
