import {createFeatureSelector, createSelector} from '@ngrx/store'

import {UserReducerState, usersAdapter} from './users.reducer'

const state = createFeatureSelector<UserReducerState>('users')
const all = createSelector(state, usersAdapter.getSelectors().selectAll)
const entities = createSelector(state, usersAdapter.getSelectors().selectEntities)

const onlineUserIds = createSelector(state, s => s.onlineIds)
const offlineUsers = createSelector(onlineUserIds, all, (ids, all) =>
  all.filter(u => !ids.includes(u.id))
)
const onlineUsers = createSelector(onlineUserIds, entities, (ids, entities) =>
  ids.map(id => entities[id])
)

export const UsersSelectors = {state, all, offlineUsers, onlineUsers}
