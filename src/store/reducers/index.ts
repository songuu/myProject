import { RootActions } from './../actions'
import { AnyAction, combineReducers, ReducersMapObject, Reducer } from 'redux'

import settings, { SettingsStateProps } from './settings'

import app, { AppStateProps } from './app'

import application, { ApplycationsStateProps } from './application'

import chat, { ChatsStateProps } from './chat'

import prompt, { PromptStateProps } from './prompt'

export type StoreActions = AnyAction | RootActions

export interface StoreStateProps {
  settings: SettingsStateProps
  app: AppStateProps
  application: ApplycationsStateProps
  chat: ChatsStateProps
  prompt: PromptStateProps
}

const reducers: ReducersMapObject<StoreStateProps, StoreActions> = {
  settings,
  app,
  application,
  chat,
  prompt,
}

const reducer: Reducer<StoreStateProps, StoreActions> =
  combineReducers(reducers)

export default reducer
