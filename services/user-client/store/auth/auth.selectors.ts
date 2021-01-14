import {LoadStatus} from '@libs/client-utils'
import {createFeatureSelector, createSelector} from '@ngrx/store'

import {AuthReducerState} from './auth.reducer'

const state = createFeatureSelector<AuthReducerState>('auth')

const initialized = createSelector(
  state,
  ({status}) => status.status === LoadStatus.Loaded || status.status === LoadStatus.Error
)
const user = createSelector(state, s => s.user)
const signInError = createSelector(state, s => s.signInStatus.error)

export const AuthSelectors = {state, initialized, user, signInError}
