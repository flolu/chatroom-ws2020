import {createAction, props} from '@ngrx/store'

import {Message, PublicUser, Room} from '@libs/schema'

/**
 * Send to server
 */
const join = createAction('rooms.join', props<{id: string}>())
const sendMessage = createAction('rooms.sendMessage', props<{message: string}>())

/**
 * Receive from server
 */
const list = createAction('rooms.list', props<{rooms: Room[]}>())
const created = createAction('rooms.created', props<{room: Room}>())
const edited = createAction('rooms.edited', props<{room: Room}>())
const deleted = createAction('rooms.deleted', props<{id: string}>())
const joined = createAction(
  'rooms.joined',
  props<{id: string; messages: Message[]; users: PublicUser[]; onlineUserIds: string[]}>()
)
const userJoined = createAction('rooms.userJoined', props<{user: PublicUser}>())
const userLeft = createAction('rooms.userLeft', props<{userId: string}>())
const incomingMessage = createAction('rooms.incomingMessage', props<{message: Message}>())

const createPrivate = createAction('rooms.createPrivate', props<{username: string}>())
const closePrivate = createAction('rooms.closePrivate', props<{id: string}>())
const privateCreated = createAction(
  'rooms.privateCreated',
  props<{room: Room; partner: PublicUser}>()
)
const privateClosed = createAction('rooms.privateClosed', props<{id: string}>())

export const RoomsActions = {
  list,
  created,
  edited,
  deleted,
  join,
  joined,
  userJoined,
  userLeft,
  incomingMessage,
  sendMessage,
  createPrivate,
  closePrivate,
  privateCreated,
  privateClosed,
}
