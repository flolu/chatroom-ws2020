import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, switchMap} from 'rxjs/operators'
import {of} from 'rxjs'

import {AuthenticatedResponse, SignInRequest} from '@libs/schema'
import {WebSocketService} from '@services'
import {AuthActions} from './auth.actions'
import {WebSocketActions} from '../websocket'

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private http: HttpClient, private wss: WebSocketService) {}

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() => {
        return this.http
          .post<AuthenticatedResponse>('http://localhost:3001/refresh', {}, {withCredentials: true})
          .pipe(
            switchMap(({username}) => [
              AuthActions.refreshTokenDone({username}),
              WebSocketActions.connect(),
            ]),
            catchError(({error}) => of(AuthActions.refreshTokenFail({error})))
          )
      })
    )
  )

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      switchMap(({username, password}) => {
        const payload: SignInRequest = {username, password}
        return this.http
          .post<AuthenticatedResponse>('http://localhost:3001/signin', payload, {
            withCredentials: true,
          })
          .pipe(
            switchMap(({username}) => [
              AuthActions.signInDone({username}),
              WebSocketActions.connect(),
            ]),
            catchError(({error}) => of(AuthActions.signInFail({error})))
          )
      })
    )
  )
}
