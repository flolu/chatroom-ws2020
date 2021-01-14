import {createFeatureSelector, createSelector} from '@ngrx/store'

import {roomsAdapter, RoomsReducerState} from './rooms.reducer'

const state = createFeatureSelector<RoomsReducerState>('rooms')
const all = createSelector(state, roomsAdapter.getSelectors().selectAll)
const entities = createSelector(state, roomsAdapter.getSelectors().selectEntities)

export const RoomsSelectors = {state, all, entities}
