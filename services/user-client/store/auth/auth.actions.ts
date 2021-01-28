import {createAction, props} from '@ngrx/store'

import {PublicUser} from '@libs/schema'

const authenticate = createAction('auth.authenticate')
const authenticateDone = createAction('auth.authenticate.done', props<{user: PublicUser}>())
const authenticateFail = createAction('auth.authenticate.fail', props<{error: string}>())

const signIn = createAction('auth.signIn', props<{username: string; password: string}>())
const signInDone = createAction('auth.signIn.done', props<{user: PublicUser}>())
const signInFail = createAction('auth.signIn.fail', props<{error: string}>())

const signOut = createAction('auth.signOut')

export const AuthActions = {
  authenticate,
  authenticateDone,
  authenticateFail,
  signIn,
  signInDone,
  signInFail,
  signOut,
}
