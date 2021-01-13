import {createAction, props} from '@ngrx/store'

import {Room} from '@libs/schema'

const create = createAction('rooms.create', props<{name: string}>())
const created = createAction('rooms.created', props<{room: Room}>())
const list = createAction('rooms.list', props<{rooms: Room[]}>())
const edit = createAction('rooms.edit', props<{id: string; name: string}>())
const remove = createAction('rooms.remove', props<{id: string}>())

export const RoomsActions = {create, created, list, edit, remove}
