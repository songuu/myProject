import { RootActions } from './../actions'
import { AnyAction, combineReducers, ReducersMapObject, Reducer } from 'redux'

import settings, { SettingsStateProps } from './settings'

import app, { AppStateProps } from './app'

export type StoreActions = AnyAction | RootActions

export interface StoreStateProps {
  settings: SettingsStateProps,
  app: AppStateProps,
}

const reducers: ReducersMapObject<StoreStateProps, StoreActions> = {
  settings,
  app,
}

const reducer: Reducer<StoreStateProps, StoreActions> =
  combineReducers(reducers)

export default reducer
