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
  username: string | undefined
  status: StatusState
}

const reducer = createReducer<Reducer>(
  {username: undefined, status: initialStatus},
  on(Actions.refreshToken, state => ({...state, status: loadingStart})),
  on(Actions.refreshTokenDone, (state, {username}) => ({...state, status: loadingDone, username})),
  on(Actions.refreshTokenFail, (state, {error}) => ({...state, status: loadingFail(error)})),

  on(Actions.signInDone, (state, {username}) => ({...state, username}))
)

export {reducer as authReducer, Reducer as AuthReducerState}
