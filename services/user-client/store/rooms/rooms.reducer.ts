import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {createReducer, on} from '@ngrx/store'

import {Room} from '@libs/schema'

import {RoomsActions as Actions} from './rooms.actions'

interface Reducer extends EntityState<Room> {
  activeRoomId: string
  onlineUserIds: string[]
  allUserIds: string[]
}

const adapter = createEntityAdapter({selectId: (room: Room) => room.id})
const reducer = createReducer<Reducer>(
  {...adapter.getInitialState(), activeRoomId: '', onlineUserIds: [], allUserIds: []},
  on(Actions.list, (state, {rooms}) => adapter.upsertMany(rooms, state)),
  on(Actions.created, (state, {room}) => adapter.upsertOne(room, state)),
  on(Actions.edited, (state, {room}) => adapter.upsertOne(room, state)),
  on(Actions.deleted, (state, {id}) => adapter.removeOne(id, state)),

  on(Actions.joined, (state, {id, onlineUserIds, users}) => ({
    ...state,
    activeRoomId: id,
    onlineUserIds,
    allUserIds: users.map(u => u.id),
  })),
  on(Actions.userJoined, (state, {user}) => ({
    ...state,
    allUserIds: state.allUserIds.includes(user.id)
      ? state.allUserIds
      : [...state.allUserIds, user.id],
    onlineUserIds: [...state.onlineUserIds, user.id],
  })),
  on(Actions.userLeft, (state, {userId}) => ({
    ...state,
    onlineUserIds: state.onlineUserIds.filter(id => id !== userId),
  })),

  on(Actions.privateCreated, (state, {room}) => adapter.upsertOne(room, state)),
  on(Actions.privateClosed, (state, {id}) => adapter.removeOne(id, state))
)

export {reducer as roomsReducer, Reducer as RoomsReducerState, adapter as roomsAdapter}
