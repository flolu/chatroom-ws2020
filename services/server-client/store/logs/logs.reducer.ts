import {createReducer, on} from '@ngrx/store'

import {NetworkLog} from '@libs/schema'
import {LogsActions as Actions} from './logs.actions'

interface Reducer {
  logs: NetworkLog[]
}

const reducer = createReducer<Reducer>(
  {logs: []},
  on(Actions.log, (state, {log}) => ({...state, logs: [...state.logs, log]}))
)

export {reducer as logsReducer, Reducer as LogsReducerState}
