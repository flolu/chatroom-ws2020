import {createAction, props} from '@ngrx/store'

const gotWarning = createAction('push.gotWarning', props<{message: string}>())
const readWarnMessage = createAction('push.readWarnMessage')

export const PushActions = {gotWarning, readWarnMessage}
