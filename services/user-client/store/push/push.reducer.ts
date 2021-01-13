import {createReducer, on} from '@ngrx/store'

import {PushActions as Actions} from './push.actions'

interface Reducer {
  warnMessage: string
}

const reducer = createReducer<Reducer>(
  {warnMessage: ''},
  on(Actions.gotWarning, (state, {message}) => ({...state, warnMessage: message})),
  on(Actions.readWarnMessage, state => ({...state, warnMessage: ''}))
)

export {reducer as pushReducer, Reducer as PushReducerState}
