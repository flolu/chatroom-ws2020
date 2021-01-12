import {createReducer, on} from '@ngrx/store'

import {
  initialStatus,
  loadingDone,
  loadingFail,
  loadingStart,
  StatusState,
} from '@libs/client-utils'
import {AuthActions as Actions} from './auth.actions'

interface Reducer {
  status: StatusState
}

const reducer = createReducer<Reducer>(
  {status: initialStatus},
  on(Actions.authenticate, state => ({...state, status: loadingStart})),
  on(Actions.authenticateDone, state => ({...state, status: loadingDone})),
  on(Actions.authenticateFail, (state, {error}) => ({...state, status: loadingFail(error)}))
)

export {reducer as authReducer, Reducer as AuthReducerState}
