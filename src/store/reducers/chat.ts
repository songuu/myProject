import * as types from '../action-types'
import { RootActions } from '../actions'

export interface ChatsStateProps {
  historys: types.ChatHistoryType[]
  chatSetting: types.ChatSettingType
  activeSession: string
  sessions: any[]
  session: any[]
}

const initialState: ChatsStateProps = {
  historys: [],
  chatSetting: {
    apiKey: '',
    apiURL: 'https://api.openai.com',
  },
  activeSession: '',
  sessions: [],
  session: [],
}

export default (state = initialState, action: RootActions): ChatsStateProps => {
  switch (action.type) {
    case types.SET_CHAT_HISTORY:
      return {
        ...state,
        historys: action.payload,
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
    case types.SET_CHAT_SETTING:
      return {
        ...state,
        chatSetting: action.payload,
      }
    case types.SET_ACTIVE_SESSION:
      return {
        ...state,
        activeSession: action.payload,
      }
    case types.SET_SESSIONS:
      return {
        ...state,
        sessions: action.payload,
      }
    case types.SET_SESSION:
      return {
        ...state,
        session: action.payload,
      }
    default:
      return state
  }
}
