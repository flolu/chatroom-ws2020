import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {filter, map} from 'rxjs/operators'

import {CreateRoom, DeleteRoom, EditRoom, ListRooms, Room} from '@libs/schema'
import {IncomingServerMessageType, OutgoingServerMessageType} from '@libs/enums'
import {WebSocketActions} from '@libs/client-utils'
import {RoomsActions} from './rooms.actions'

@Injectable()
export class RoomsEffects {
  constructor(private actions$: Actions) {}

  list$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingServerMessageType.ListRooms),
      map(({payload}) => RoomsActions.list({rooms: (payload as ListRooms).rooms}))
    )
  )

  created$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingServerMessageType.CreatedRoom),
      map(({payload}) => RoomsActions.created({room: payload as Room}))
    )
  )

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoomsActions.create),
      map(({name}) => {
        const payload: CreateRoom = {name}
        return WebSocketActions.send({messageType: IncomingServerMessageType.CreateRoom, payload})
      })
    )
  )

  edit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoomsActions.edit),
      map(({id, name}) => {
        const payload: EditRoom = {id, name}
        return WebSocketActions.send({messageType: IncomingServerMessageType.EditRoom, payload})
      })
    )
  )

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoomsActions.remove),
      map(({id}) => {
        const payload: DeleteRoom = {id}
        return WebSocketActions.send({messageType: IncomingServerMessageType.DeleteRoom, payload})
      })
    )
  )
}
