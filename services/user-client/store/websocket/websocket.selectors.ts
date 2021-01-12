import {createFeatureSelector} from '@ngrx/store'

import {WebSocketReducerState} from './websocket.reducer'

const state = createFeatureSelector<WebSocketReducerState>('websocket')

export const WebSocketSelectors = {state}
