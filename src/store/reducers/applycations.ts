import * as types from '../action-types';
import { RootActions } from '../actions';

export interface ApplycationsStateProps {
  applycations: any[];
}

const initialState: ApplycationsStateProps = {
  applycations: []
}

export default (state = initialState, action: RootActions): ApplycationsStateProps => {
  switch (action.type) {
    case types.SET_APPLYCATIONS:
      return {
        ...state,
        applycations: action.payload
      }
    default:
      return state;
  }
}