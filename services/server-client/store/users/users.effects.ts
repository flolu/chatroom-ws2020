import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {filter, map} from 'rxjs/operators'

import {ListUsers, UserCreated, UserWentOnline} from '@libs/schema'
import {OutgoingServerMessageType} from '@libs/enums'
import {WebSocketActions} from '@libs/client-utils'
import {UsersActions} from './users.actions'

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions) {}

  list$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingServerMessageType.ListUsers),
      map(({payload}) => UsersActions.list({users: (payload as ListUsers).users}))
    )
  )

  created$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingServerMessageType.UserCreated),
      map(({payload}) => UsersActions.created({user: (payload as UserCreated).user}))
    )
  )

  wentOnline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingServerMessageType.UserWentOnline),
      map(({payload}) => UsersActions.wentOnline({userId: (payload as UserWentOnline).userId}))
    )
  )

  wentOffline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingServerMessageType.UserWentOffline),
      map(({payload}) => UsersActions.wentOffline({userId: (payload as UserWentOnline).userId}))
    )
  )
}
