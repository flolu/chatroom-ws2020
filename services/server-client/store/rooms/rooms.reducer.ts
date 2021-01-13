import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {createReducer, on} from '@ngrx/store'

import {Room} from '@libs/schema'
import {RoomsActions as Actions} from './rooms.actions'

interface Reducer extends EntityState<Room> {}

const adapter = createEntityAdapter({selectId: (room: Room) => room.id})
const reducer = createReducer(
  adapter.getInitialState(),
  on(Actions.list, (state, {rooms}) => adapter.upsertMany(rooms, state)),
  on(Actions.created, (state, {room}) => adapter.upsertOne(room, state)),
  on(Actions.edit, (state, {id, name}) => adapter.updateOne({id, changes: {name}}, state)),
  on(Actions.remove, (state, {id}) => adapter.removeOne(id, state))
)

export {reducer as roomsReducer, Reducer as RoomsReducerState, adapter as roomsAdapter}
