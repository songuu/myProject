import { AnyAction, combineReducers, ReducersMapObject, Reducer } from 'redux'

export type StoreActions = AnyAction

export interface StoreStateProps { }

const reducers: ReducersMapObject<StoreStateProps, StoreActions> = {}

const reducer: Reducer<StoreStateProps, StoreActions> = combineReducers(reducers)

export default reducer;