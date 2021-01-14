import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {filter, map} from 'rxjs/operators'

import {NetworkLog} from '@libs/schema'
import {OutgoingServerMessageType} from '@libs/enums'
import {WebSocketActions} from '@libs/client-utils'
import {LogsActions} from './logs.actions'

@Injectable()
export class LogsEffects {
  constructor(private actions$: Actions) {}

  list$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingServerMessageType.Log),
      map(({payload}) => LogsActions.log({log: payload as NetworkLog}))
    )
  )
}
