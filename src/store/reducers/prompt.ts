import * as types from '../action-types'
import { RootActions } from '../actions'

export interface PromptStateProps {
  promptList: Prompt.Prompt[]
}

const initialState: PromptStateProps = {
  promptList: [],
}

export default (state = initialState, action: RootActions): PromptStateProps => {
  switch (action.type) {
    case types.SET_PROMPT_LIST:
      return {
        ...state,
        promptList: action.payload,
      }
    default:
      return state
  }
}