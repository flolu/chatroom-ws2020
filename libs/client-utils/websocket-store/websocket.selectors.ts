import {createFeatureSelector, createSelector} from '@ngrx/store'
import {LoadStatus} from '../state.helper'

import {WebSocketReducerState} from './websocket.reducer'

const state = createFeatureSelector<WebSocketReducerState>('websocket')

const initialized = createSelector(
  state,
  ({status}) => status.status === LoadStatus.Loaded || status.status === LoadStatus.Error
)

export const WebSocketSelectors = {state, initialized}
