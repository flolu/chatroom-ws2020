import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {filter, map} from 'rxjs/operators'

import {WebSocketActions} from '@libs/client-utils'
import {WarnUser} from '@libs/schema'
import {OutgoingClientMessageType} from '@libs/enums'
import {PushActions} from './push.actions'

@Injectable()
export class PushEffects {
  constructor(private actions$: Actions) {}

  gotWarning$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.GotWarning),
      map(({payload}: {payload: WarnUser}) => PushActions.gotWarning({message: payload.message}))
    )
  )
}
