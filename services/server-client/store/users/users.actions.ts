import {createAction, props} from '@ngrx/store'

import {PublicUser} from '@libs/schema'

const list = createAction('users.list', props<{users: PublicUser[]}>())
const created = createAction('users.created', props<{user: PublicUser}>())
const wentOnline = createAction('users.wentOnline', props<{userId: string}>())
const wentOffline = createAction('users.wentOffline', props<{userId: string}>())

export const UsersActions = {list, wentOnline, wentOffline, created}
