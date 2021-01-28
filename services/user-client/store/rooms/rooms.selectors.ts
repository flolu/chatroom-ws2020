import {createFeatureSelector, createSelector} from '@ngrx/store'

import {UsersSelectors} from '../users/users.selectors'
import {roomsAdapter, RoomsReducerState} from './rooms.reducer'

const state = createFeatureSelector<RoomsReducerState>('rooms')
const all = createSelector(state, roomsAdapter.getSelectors().selectAll)
const entities = createSelector(state, roomsAdapter.getSelectors().selectEntities)

const activeRoomId = createSelector(state, s => s.activeRoomId)
const activeRoom = createSelector(
  state,
  entities,
  (state, entities) => entities[state.activeRoomId]
)
const onlineUsers = createSelector(UsersSelectors.entities, state, (entities, state) =>
  state.onlineUserIds.map(id => entities[id])
)
const offlineUsers = createSelector(UsersSelectors.entities, state, (entities, state) => {
  const offlineIds = state.allUserIds.filter(id => !state.onlineUserIds.includes(id))
  return offlineIds.map(id => entities[id])
})

const messages = createSelector(state, s => s.messages)
const messagesWithUser = createSelector(UsersSelectors.entities, messages, (entities, messages) =>
  messages.map(m => ({...m, user: entities[m.fromId]}))
)

const publicRooms = createSelector(all, rooms => rooms.filter(r => !r.isPrivate))
const privateRooms = createSelector(all, rooms => rooms.filter(r => r.isPrivate))

export const RoomsSelectors = {
  state,
  publicRooms,
  privateRooms,
  activeRoomId,
  activeRoom,
  onlineUsers,
  offlineUsers,
  messages,
  messagesWithUser,
}
