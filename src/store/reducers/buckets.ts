import * as types from '../action-types'
import { RootActions } from '../actions'

export interface BucketsStateProps {
  activeApp: any
  activeBucket: any
  buckets: any[]
  apps: any[]
}

const initialState: BucketsStateProps = {
  activeApp: {},
  activeBucket: {},
  buckets: [],
  apps: [],
}

export default (
  state = initialState,
  action: RootActions
): BucketsStateProps => {
  switch (action.type) {
    case types.SET_ACTIVE_APP:
      return {
        ...state,
        activeApp: action.payload,
      }
    case types.SET_ACTIVE_BUCKET:
      return {
        ...state,
        activeBucket: action.payload,
      }
    case types.SET_BUCKETS:
      return {
        ...state,
        buckets: action.payload,
      }
    case types.SET_ALL_APPS:
      return {
        ...state,
        apps: action.payload,
      }
    default:
      return state
  }
}
