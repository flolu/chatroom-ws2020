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

export {reducer as usersReducer, Reducer as UserReducerState, adapter as usersAdapter}
