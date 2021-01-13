import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {filter, map} from 'rxjs/operators'

import {
  BanUserRequest,
  KickUserRequest,
  ListUsers,
  UserCreated,
  UserWentOnline,
  WarnUserRequest,
} from '@libs/schema'
import {IncomingServerMessageType, OutgoingServerMessageType} from '@libs/enums'
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

  warnUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.warn),
      map(({id, message}) => {
        const payload: WarnUserRequest = {userId: id, message}
        return WebSocketActions.send({messageType: IncomingServerMessageType.WarnUser, payload})
      })
    )
  )

  kickUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.kick),
      map(({id}) => {
        const payload: KickUserRequest = {userId: id}
        return WebSocketActions.send({messageType: IncomingServerMessageType.KickUser, payload})
      })
    )
  )

  banUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.ban),
      map(({id}) => {
        const payload: BanUserRequest = {userId: id}
        return WebSocketActions.send({messageType: IncomingServerMessageType.BanUser, payload})
      })
    )
  )
}
