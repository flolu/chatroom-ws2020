import {createAction, props} from '@ngrx/store'

const refreshToken = createAction('auth.refreshToken')
const refreshTokenDone = createAction('auth.refreshToken.done', props<{username: string}>())
const refreshTokenFail = createAction('auth.refreshToken.fail', props<{error: string}>())

const signIn = createAction('auth.signIn', props<{username: string; password: string}>())
const signInDone = createAction('auth.signIn.done', props<{username: string}>())
const signInFail = createAction('auth.signIn.fail', props<{error: string}>())

export const AuthActions = {
  refreshToken,
  refreshTokenDone,
  refreshTokenFail,
  signIn,
  signInDone,
  signInFail,
}
