import {createAction, props} from '@ngrx/store'

const connect = createAction('websocket.connect')
const opened = createAction('websocket.connected')
const closed = createAction('websocket.closed', props<{reason: string}>())
const error = createAction('websocket.error')

const send = createAction('websocket.send', props<{messageType: string; payload: any}>())
const message = createAction('websocket.message', props<{messageType: string; payload: any}>())

export const WebSocketActions = {connect, opened, closed, error, send, message}
