import {createFeatureSelector} from '@ngrx/store'

import {AuthReducerState} from './auth.reducer'

const state = createFeatureSelector<AuthReducerState>('auth')

export const AuthSelectors = {state}
