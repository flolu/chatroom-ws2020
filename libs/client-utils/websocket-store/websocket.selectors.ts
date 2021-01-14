import {createFeatureSelector, createSelector} from '@ngrx/store'
import {LoadStatus} from '../state.helper'

import {WebSocketReducerState} from './websocket.reducer'

const state = createFeatureSelector<WebSocketReducerState>('websocket')

const initialized = createSelector(
  state,
  ({status}) => status.status === LoadStatus.Loaded || status.status === LoadStatus.Error
)
const isConnected = createSelector(state, s => s.status.status === LoadStatus.Loaded)
const error = createSelector(state, s => s.status.error)

export const WebSocketSelectors = {state, initialized, isConnected, error}
