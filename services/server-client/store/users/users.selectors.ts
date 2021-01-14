import {createFeatureSelector, createSelector} from '@ngrx/store'

import {RoomsSelectors} from '../rooms/rooms.selectors'

import {
  UserReducerState,
  userRoomAdapter,
  UserRoomReducerState,
  usersAdapter,
} from './users.reducer'

const state = createFeatureSelector<UserReducerState>('users')
const all = createSelector(state, usersAdapter.getSelectors().selectAll)
const entities = createSelector(state, usersAdapter.getSelectors().selectEntities)

const userRoomState = createFeatureSelector<UserRoomReducerState>('userRooms')
const userRoomEntities = createSelector(
  userRoomState,
  userRoomAdapter.getSelectors().selectEntities
)

const onlineUserIds = createSelector(state, s => s.onlineIds)
const offlineUsers = createSelector(onlineUserIds, all, (ids, all) =>
  all.filter(u => !ids.includes(u.id))
)
const onlineUsers = createSelector(
  onlineUserIds,
  entities,
  userRoomEntities,
  RoomsSelectors.entities,
  (ids, entities, userRoomEntities, roomEntities) => {
    const users = ids.map(id => entities[id]!)
    const usersWIthRooms = users.map(u => {
      const roomId = userRoomEntities[u.id]?.roomId
      return {...u, room: roomId ? roomEntities[roomId] : undefined}
    })
    return usersWIthRooms
  }
)

export const UsersSelectors = {state, all, offlineUsers, onlineUsers}
