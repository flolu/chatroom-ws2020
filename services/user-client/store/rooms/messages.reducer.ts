import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {createReducer, on} from '@ngrx/store'

import {Message} from '@libs/schema'

import {RoomsActions} from './rooms.actions'

interface Reducer extends EntityState<Message> {}

const adapter = createEntityAdapter({selectId: (message: Message) => message.id})
const reducer = createReducer<Reducer>(
  adapter.getInitialState(),
  on(RoomsActions.list, (state, {messages}) => adapter.upsertMany(messages, state)),
  on(RoomsActions.joined, (state, {messages}) => adapter.upsertMany(messages, state)),
  on(RoomsActions.incomingMessage, (state, {message}) => adapter.upsertOne(message, state))
)

export {reducer as messagesReducer, Reducer as MessagesReducerState, adapter as messagesAdapter}
