import {createFeatureSelector, createSelector} from '@ngrx/store'

import {LoadStatus} from '@libs/client-utils'
import {AuthReducerState} from './auth.reducer'

const state = createFeatureSelector<AuthReducerState>('auth')

const initialized = createSelector(
  state,
  ({status}) => status.status === LoadStatus.Loaded || status.status === LoadStatus.Error
)

export const AuthSelectors = {state, initialized}
