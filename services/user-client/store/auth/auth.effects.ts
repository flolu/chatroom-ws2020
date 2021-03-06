import {Injectable} from '@angular/core'
import {Router} from '@angular/router'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {UserClientRoutes} from '@shared'
import {filter, map, tap} from 'rxjs/operators'

import {WebSocketActions} from '@libs/client-utils'
import {IncomingClientMessageeType, OutgoingClientMessageType} from '@libs/enums'
import {
    AuthenticateFail, AuthenticateRequest, AuthenticateSuccess, SignInFail, SignInRequest,
    SignInSuccess
} from '@libs/schema'

import {AuthActions} from './auth.actions'

@Injectable()
export class AuthEffects {
  private tokenKey = 'token'

  constructor(private actions$: Actions, private router: Router) {}

  authenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticate),
      map(() => {
        const token = localStorage.getItem(this.tokenKey)
        if (!token) return AuthActions.authenticateFail({error: 'No token found'})

        const payload: AuthenticateRequest = {token}
        return WebSocketActions.send({
          messageType: IncomingClientMessageeType.Authenticate,
          payload,
        })
      })
    )
  )

  authenticateDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.AuthenticateDone),
      map(({payload}: {payload: AuthenticateSuccess}) => {
        localStorage.setItem(this.tokenKey, payload.token)
        this.router.navigate([UserClientRoutes.Home])
        return AuthActions.authenticateDone({user: payload.user})
      })
    )
  )

  authenticateFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.AuthenticateFail),
      map(({payload}: {payload: AuthenticateFail}) => {
        localStorage.setItem(this.tokenKey, '')
        this.router.navigate([UserClientRoutes.SignIn])
        return AuthActions.authenticateFail({error: payload.error})
      })
    )
  )

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      map(({username, password}) => {
        const payload: SignInRequest = {username, password}
        return WebSocketActions.send({
          messageType: IncomingClientMessageeType.SignIn,
          payload,
        })
      })
    )
  )

  signInDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.SignInDone),
      map(({payload}: {payload: SignInSuccess}) => {
        localStorage.setItem(this.tokenKey, payload.token)
        this.router.navigate([UserClientRoutes.Home])
        return AuthActions.signInDone({user: payload.user})
      })
    )
  )

  signInFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.SignInFail),
      map(({payload}: {payload: SignInFail}) => {
        localStorage.setItem(this.tokenKey, '')
        this.router.navigate([UserClientRoutes.SignIn])
        return AuthActions.signInFail({error: payload.error})
      })
    )
  )

  signOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signOut),
        tap(() => {
          localStorage.setItem(this.tokenKey, '')
          this.router.navigate([UserClientRoutes.SignIn])
        })
      ),
    {dispatch: false}
  )
}
