import { RootActions } from './../actions'
import { AnyAction, combineReducers, ReducersMapObject, Reducer } from 'redux'

import settings, { SettingsStateProps } from './settings'

export type StoreActions = AnyAction | RootActions

export interface StoreStateProps {
  settings: SettingsStateProps
}

const reducers: ReducersMapObject<StoreStateProps, StoreActions> = {
  settings,
}

const reducer: Reducer<StoreStateProps, StoreActions> =
  combineReducers(reducers)

export default reducer
