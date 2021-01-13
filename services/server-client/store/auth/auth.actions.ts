import {createAction, props} from '@ngrx/store'

const authenticate = createAction('auth.authenticate', props<{secret: string}>())
const authenticateDone = createAction('auth.authenticate.done')

export const AuthActions = {
  authenticate,
  authenticateDone,
}
