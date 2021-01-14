import {createFeatureSelector, createSelector} from '@ngrx/store'

import {LogsReducerState} from './logs.reducer'

const state = createFeatureSelector<LogsReducerState>('logs')
const all = createSelector(state, s => s.logs)

export const LogsSelectors = {state, all}
