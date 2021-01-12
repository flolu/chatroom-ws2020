import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, switchMap} from 'rxjs/operators'
import {of} from 'rxjs'

import {WebSocketActions} from '@libs/client-utils'
import {AuthenticatedResponse, SignInRequest} from '@libs/schema'
import {ApiRoutes, UserApiRoutes} from '@libs/enums'
import {AuthActions} from './auth.actions'

@Injectable()
export class AuthEffects {
  private api = `http://localhost:3001/${ApiRoutes.User}`

  constructor(private actions$: Actions, private http: HttpClient) {}

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() => {
        return this.http
          .post<AuthenticatedResponse>(
            `${this.api}/${UserApiRoutes.Refresh}`,
            {},
            {withCredentials: true}
          )
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
          .post<AuthenticatedResponse>(`${this.api}/${UserApiRoutes.SignIn}`, payload, {
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
