import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, switchMap} from 'rxjs/operators'
import {of} from 'rxjs'

import {AdminSignInRequest} from '@libs/schema'
import {AdminApiRoutes, ApiRoutes} from '@libs/enums'
import {AuthActions} from './auth.actions'
import {WebSocketActions} from '../websocket'

@Injectable()
export class AuthEffects {
  private api = `http://localhost:3001/${ApiRoutes.Admin}`

  constructor(private actions$: Actions, private http: HttpClient) {}

  authenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticate),
      switchMap(({secret}) => {
        const payload: AdminSignInRequest = {secret}
        return this.http
          .post(`${this.api}/${AdminApiRoutes.Authenticate}`, payload, {withCredentials: true})
          .pipe(
            switchMap(() => [AuthActions.authenticateDone(), WebSocketActions.connect()]),
            catchError(({error}) => of(AuthActions.authenticateFail({error})))
          )
      })
    )
  )
}
