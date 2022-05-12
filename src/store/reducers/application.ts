import * as types from '../action-types'
import { RootActions } from '../actions'
import { list } from '@root/constants/application'

type applyType = {
  name: string
  category: string[]
}

const initApp = list
  .filter((item: applyType) => item.category.includes('全部应用'))
  .map((item: applyType) => item.name)

export interface ApplycationsStateProps {
  applycations: string[]
}

const initialState: ApplycationsStateProps = {
  applycations: initApp,
}

export default (
  state = initialState,
  action: RootActions
): ApplycationsStateProps => {
  switch (action.type) {
    case types.SET_APPLYCATIONS:
      return {
        ...state,
        applycations: action.payload,
      }
    case types.UPDATE_APPLYCATIONS:
      return {
        ...state,
        applycations: list
          .filter((item: applyType) => item.category.includes(action.payload))
          .map((item: applyType) => item.name),
      }
    default:
      return state
  }
}
