import { RootActions } from './../actions'
import { AnyAction, combineReducers, ReducersMapObject, Reducer } from 'redux'

import settings, { SettingsStateProps } from './settings'

import app, { AppStateProps } from './app'

import application, { ApplycationsStateProps } from './application'

export type StoreActions = AnyAction | RootActions

export interface StoreStateProps {
  settings: SettingsStateProps
  app: AppStateProps
  application: ApplycationsStateProps
}

const reducers: ReducersMapObject<StoreStateProps, StoreActions> = {
  settings,
  app,
  application,
}

const reducer: Reducer<StoreStateProps, StoreActions> =
  combineReducers(reducers)

export default reducer
