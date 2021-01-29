import {createFeatureSelector, createSelector} from '@ngrx/store'
import {AuthSelectors} from '@store/auth/auth.selectors'

import {UsersSelectors} from '../users/users.selectors'
import {messagesAdapter, MessagesReducerState} from './messages.reducer'
import {roomsAdapter, RoomsReducerState} from './rooms.reducer'

const state = createFeatureSelector<RoomsReducerState>('rooms')
const messagesState = createFeatureSelector<MessagesReducerState>('messages')
const allMessages = createSelector(messagesState, messagesAdapter.getSelectors().selectAll)
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

const selectedMessages = createSelector(activeRoomId, allMessages, (id, all) =>
  all.filter(m => m.roomId === id)
)
const selectedMessagesWithUser = createSelector(
  UsersSelectors.entities,
  selectedMessages,
  (entities, messages) => messages.map(m => ({...m, user: entities[m.fromId]}))
)

const roomsWithMetadata = createSelector(
  all,
  allMessages,
  AuthSelectors.user,
  UsersSelectors.entities,
  (rooms, messages, user, userEntities) => {
    if (!user) return []

    const roomsWithMetadata = rooms.map(room => {
      const lastMessage = messages
        .filter(m => m.roomId === room.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .pop()
      const partnerId =
        room.privateSettings?.privateUser1Id === user!.id
          ? room.privateSettings?.privateUser2Id
          : room.privateSettings?.privateUser1Id
      const partner = userEntities[partnerId!]
      return {
        room,
        lastMessage,
        partner,
      }
    })

    return roomsWithMetadata.sort((a, b) => {
      if (!b.lastMessage) return -1
      return (
        (b.lastMessage ? new Date(b.lastMessage!.timestamp).getTime() : 0) -
        (a.lastMessage ? new Date(a.lastMessage!.timestamp).getTime() : 0)
      )
    })
  }
)

const selectedPartner = createSelector(
  activeRoom,
  UsersSelectors.entities,
  AuthSelectors.user,
  (room, userEntities, user) => {
    if (!room) return undefined
    if (!room.isPrivate) return undefined
    const partnerId =
      room.privateSettings!.privateUser1Id === user!.id
        ? room.privateSettings!.privateUser2Id
        : room.privateSettings!.privateUser1Id
    return userEntities[partnerId]
  }
)

export const RoomsSelectors = {
  state,
  activeRoomId,
  activeRoom,
  onlineUsers,
  offlineUsers,
  selectedMessagesWithUser,
  roomsWithMetadata,
  selectedPartner,
}
