import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {filter, map} from 'rxjs/operators'

import {JoinedRoom, JoinRoom, ListRooms, Message, PublicUser, Room} from '@libs/schema'
import {IncomingClientMessageeType, OutgoingClientMessageType} from '@libs/enums'
import {WebSocketActions} from '@libs/client-utils'
import {RoomsActions} from './rooms.actions'

@Injectable()
export class RoomsEffects {
  constructor(private actions$: Actions) {}

  list$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.ListRooms),
      map(({payload}) => RoomsActions.list({rooms: (payload as ListRooms).rooms}))
    )
  )

  created$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.RoomCreated),
      map(({payload}) => RoomsActions.created({room: payload as Room}))
    )
  )

  edited$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.RoomEdited),
      map(({payload}) => RoomsActions.edited({room: payload as Room}))
    )
  )

  deleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.RoomDeleted),
      map(({payload}) => RoomsActions.deleted({id: payload as string}))
    )
  )

  join$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoomsActions.join),
      map(({id}) => {
        const payload: JoinRoom = {id}
        return WebSocketActions.send({messageType: IncomingClientMessageeType.JoinRoom, payload})
      })
    )
  )

  joined$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.RoomJoinInfo),
      map(({payload}) => {
        const {id, messages, users, onlineUserIds} = payload as JoinedRoom
        return RoomsActions.joined({id, messages, users, onlineUserIds})
      })
    )
  )

  userJoined$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.UserJoinedRoom),
      map(({payload}) => RoomsActions.userJoined({user: payload as PublicUser}))
    )
  )

  userLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.UserLeftRoom),
      map(({payload}) => RoomsActions.userLeft({userId: payload as string}))
    )
  )

  incomingMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.message),
      filter(({messageType}) => messageType === OutgoingClientMessageType.IncomingMessage),
      map(({payload}) => RoomsActions.incomingMessage({message: payload as Message}))
    )
  )

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoomsActions.sendMessage),
      map(({message}) => {
        return WebSocketActions.send({
          messageType: IncomingClientMessageeType.SendMessage,
          payload: message,
        })
      })
    )
  )
}
