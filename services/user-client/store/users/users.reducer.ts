import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {createReducer, on} from '@ngrx/store'

import {PublicUser} from '@libs/schema'

import {RoomsActions} from '../rooms/rooms.actions'

interface Reducer extends EntityState<PublicUser> {}

const adapter = createEntityAdapter({selectId: (room: PublicUser) => room.id})
const reducer = createReducer<Reducer>(
  adapter.getInitialState(),
  on(RoomsActions.joined, (state, {users}) => adapter.upsertMany(users, state)),
  on(RoomsActions.userJoined, (state, {user}) => adapter.upsertOne(user, state)),
  on(RoomsActions.privateCreated, (state, {partner}) => adapter.upsertOne(partner, state))
)

export {reducer as usersReducer, Reducer as UserReducerState, adapter as usersAdapter}
