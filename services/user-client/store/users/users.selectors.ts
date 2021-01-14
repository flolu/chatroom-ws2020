import {createFeatureSelector, createSelector} from '@ngrx/store'

import {UserReducerState, usersAdapter} from './users.reducer'

const state = createFeatureSelector<UserReducerState>('users')
const entities = createSelector(state, usersAdapter.getSelectors().selectEntities)

export const UsersSelectors = {state, entities}
