import {createReducer, on} from '@ngrx/store'

import {
  initialStatus,
  loadingDone,
  loadingFail,
  loadingStart,
  StatusState,
} from '@libs/client-utils'
import {AuthActions} from '@store'

interface Reducer {
  status: StatusState
}

const reducer = createReducer<Reducer>(
  {status: initialStatus},
  on(AuthActions.signIn, state => ({...state, status: loadingStart})),
  on(AuthActions.signInDone, state => ({...state, status: loadingDone})),
  on(AuthActions.signInFail, (state, {error}) => ({...state, status: loadingFail(error)}))
)

export {reducer as signInReducer, Reducer as SignInReducerState}
