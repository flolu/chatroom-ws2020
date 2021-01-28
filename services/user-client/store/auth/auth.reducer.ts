import {createReducer, on} from '@ngrx/store'

import {
    initialStatus, loadingDone, loadingFail, loadingStart, StatusState
} from '@libs/client-utils'
import {PublicUser} from '@libs/schema'

import {AuthActions as Actions} from './auth.actions'

interface Reducer {
  user: PublicUser | undefined
  status: StatusState
  signInStatus: StatusState
}

const reducer = createReducer<Reducer>(
  {user: undefined, status: initialStatus, signInStatus: initialStatus},
  on(Actions.authenticate, state => ({...state, status: loadingStart})),
  on(Actions.authenticateDone, (state, {user}) => ({...state, status: loadingDone, user})),
  on(Actions.authenticateFail, (state, {error}) => ({...state, status: loadingFail(error)})),

  on(Actions.signIn, state => ({...state, signInStatus: loadingStart})),
  on(Actions.signInDone, (state, {user}) => ({...state, signInStatus: loadingDone, user})),
  on(Actions.signInFail, (state, {error}) => ({...state, signInStatus: loadingFail(error)})),

  on(Actions.signOut, state => ({
    ...state,
    user: undefined,
    signInStatus: initialStatus,
    status: initialStatus,
  }))
)

export {reducer as authReducer, Reducer as AuthReducerState}
