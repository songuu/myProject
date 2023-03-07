import { RootActions } from './../actions'
import { AnyAction, combineReducers, ReducersMapObject, Reducer } from 'redux'

import settings, { SettingsStateProps } from './settings'

import app, { AppStateProps } from './app'

import application, { ApplycationsStateProps } from './application'

import chat, { ChatsStateProps } from './chat'

export type StoreActions = AnyAction | RootActions

export interface StoreStateProps {
  settings: SettingsStateProps
  app: AppStateProps
  application: ApplycationsStateProps
  chat: ChatsStateProps
}

const reducers: ReducersMapObject<StoreStateProps, StoreActions> = {
  settings,
  app,
  application,
  chat,
}

const reducer: Reducer<StoreStateProps, StoreActions> =
  combineReducers(reducers)

export default reducer
