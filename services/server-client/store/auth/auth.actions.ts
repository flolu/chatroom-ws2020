import {createAction, props} from '@ngrx/store'

const authenticate = createAction('auth.authenticate', props<{secret: string}>())
const authenticateDone = createAction('auth.authenticate.done')
const authenticateFail = createAction('auth.authenticate.fail', props<{error: string}>())

export const AuthActions = {
  authenticate,
  authenticateDone,
  authenticateFail,
}
