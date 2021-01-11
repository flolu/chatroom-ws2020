import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, map, switchMap, tap} from 'rxjs/operators'
import {of} from 'rxjs'

import {AuthenticatedResponse, SignInRequest} from '@libs/schema'
import {WebSocketService} from '../websocket.service'
import {AuthActions} from './auth.actions'

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
            map(({username}) => AuthActions.refreshTokenDone({username})),
            catchError(({error}) => of(AuthActions.refreshTokenFail({error})))
          )
      })
    )
  )

  refreshDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenDone),
        tap(() => {
          this.wss.connect()
        })
      ),
    {dispatch: false}
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
            map(({username}) => AuthActions.signInDone({username})),
            catchError(({error}) => of(AuthActions.signInFail({error})))
          )
      })
    )
  )

  signInDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInDone),
        tap(() => {
          this.wss.connect()
        })
      ),
    {dispatch: false}
  )
}
