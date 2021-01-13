import {createFeatureSelector, createSelector} from '@ngrx/store'

import {PushReducerState} from './push.reducer'

const state = createFeatureSelector<PushReducerState>('push')
const warnMessage = createSelector(state, s => s.warnMessage)

export const PushSelectors = {state, warnMessage}
