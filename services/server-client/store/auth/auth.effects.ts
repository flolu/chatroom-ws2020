import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {filter, map} from 'rxjs/operators'

import {IncomingServerMessageType, OutgoingServerMessageType} from '@libs/enums'
import {WebSocketActions} from '@libs/client-utils'
import {AuthenticateAdmin} from '@libs/schema'
import {AuthActions} from './auth.actions'

@Injectable()
export class AuthEffects {
  private adminSecret = 'lOINo6JX6y1iKSEx0NJ0XdFlhUvtCeGt'

  constructor(private actions$: Actions) {}

  authenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticate),
      map(() => {
        const payload: AuthenticateAdmin = {secret: this.adminSecret}
        return WebSocketActions.send({messageType: IncomingServerMessageType.Authenticate, payload})
      })
    )
  )

  authenticated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingServerMessageType.Authenticated),
      map(() => AuthActions.authenticateDone())
    )
  )
}
