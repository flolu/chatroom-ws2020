import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {createReducer, on} from '@ngrx/store'

import {PublicUser} from '@libs/schema'
import {UsersActions as Actions} from './users.actions'

interface Reducer extends EntityState<PublicUser> {
  onlineIds: string[]
}

const adapter = createEntityAdapter({selectId: (room: PublicUser) => room.id})
const reducer = createReducer<Reducer>(
  {...adapter.getInitialState(), onlineIds: []},
  on(Actions.list, (state, {users}) => adapter.upsertMany(users, state)),
  on(Actions.created, (state, {user}) =>
    adapter.upsertOne(user, {...state, onlineIds: [...state.onlineIds, user.id]})
  ),
  on(Actions.wentOnline, (state, {userId}) => ({
    ...state,
    onlineIds: [...state.onlineIds, userId],
  })),
  on(Actions.wentOffline, (state, {userId}) => ({
    ...state,
    onlineIds: state.onlineIds.filter(id => id !== userId),
  }))
)

interface UserRoomMap {
  userId: string
  roomId: string
}

interface UserRoomReducer extends EntityState<UserRoomMap> {}

const userRoomAdapter = createEntityAdapter({selectId: (map: UserRoomMap) => map.userId})
const userRoomReducer = createReducer<UserRoomReducer>(
  userRoomAdapter.getInitialState(),
  on(Actions.joinedRoom, (state, {userId, roomId}) =>
    userRoomAdapter.upsertOne({userId, roomId}, state)
  ),
  on(Actions.leftRoom, (state, {userId}) => userRoomAdapter.upsertOne({userId, roomId: ''}, state)),
  on(Actions.wentOnline, (state, {userId}) =>
    userRoomAdapter.upsertOne({userId, roomId: ''}, state)
  ),
  on(Actions.wentOffline, (state, {userId}) =>
    userRoomAdapter.upsertOne({userId, roomId: ''}, state)
  )
)

export {
  reducer as usersReducer,
  Reducer as UserReducerState,
  adapter as usersAdapter,
  userRoomReducer,
  userRoomAdapter,
  UserRoomReducer as UserRoomReducerState,
}
