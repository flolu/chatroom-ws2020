import {createFeatureSelector, createSelector} from '@ngrx/store'

import {roomsAdapter, RoomsReducerState} from './rooms.reducer'

const state = createFeatureSelector<RoomsReducerState>('rooms')
const all = createSelector(state, roomsAdapter.getSelectors().selectAll)
const entities = createSelector(state, roomsAdapter.getSelectors().selectEntities)

const activeRoom = createSelector(
  state,
  entities,
  (state, entities) => entities[state.activeRoomId]
)
const onlineUsers = createSelector(state, s => s.users.filter(u => s.onlineUserIds.includes(u.id)))
const offlineUsers = createSelector(state, s =>
  s.users.filter(u => !s.onlineUserIds.includes(u.id))
)
const messages = createSelector(state, s => s.messages)

export const RoomsSelectors = {state, all, activeRoom, onlineUsers, offlineUsers, messages}
