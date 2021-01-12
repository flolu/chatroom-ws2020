import {createAction, props} from '@ngrx/store'

const connect = createAction('websocket.connect')
const opened = createAction('websocket.connected')
const closed = createAction('websocket.closed', props<{reason: string}>())
const error = createAction('websocket.error')

export const WebSocketActions = {connect, opened, closed, error}
