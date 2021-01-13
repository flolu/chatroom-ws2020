import {createReducer, on} from '@ngrx/store'

import {StatusState, initialStatus, loadingStart, loadingDone, loadingFail} from '../state.helper'
import {WebSocketActions as Actions} from './websocket.actions'

interface Reducer {
  status: StatusState
}

const reducer = createReducer<Reducer>(
  {status: initialStatus},
  on(Actions.connect, state => ({...state, status: loadingStart})),
  on(Actions.opened, state => ({...state, status: loadingDone})),
  on(Actions.closed, (state, {reason}) => ({...state, status: loadingFail(reason)})),
  on(Actions.error, state => ({...state, status: loadingFail('Unknown error')}))
)

export {reducer as websocketReducer, Reducer as WebSocketReducerState}
