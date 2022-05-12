import * as types from '../action-types'

export interface UpdateApplycationAction {
  type: types.UPDATE_APPLYCATIONS_TYPE
  payload: string
}

export const updateApplycation = (
  payload: string
): UpdateApplycationAction => ({
  type: types.UPDATE_APPLYCATIONS,
  payload,
})
