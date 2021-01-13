import {createAction, props} from '@ngrx/store'

import {Room} from '@libs/schema'

const list = createAction('rooms.list', props<{rooms: Room[]}>())
const created = createAction('rooms.created', props<{room: Room}>())
const edited = createAction('rooms.edited', props<{room: Room}>())
const deleted = createAction('rooms.deleted', props<{id: string}>())
const join = createAction('rooms.join', props<{id: string}>())

export const RoomsActions = {list, created, edited, deleted, join}
