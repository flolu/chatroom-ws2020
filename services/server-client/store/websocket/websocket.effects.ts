import {Injectable} from '@angular/core'
import {Action} from '@ngrx/store'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {switchMap, tap} from 'rxjs/operators'
import {Router} from '@angular/router'
import {Observable} from 'rxjs'

import {SocketMessage} from '@libs/schema'
import {AdminClientRoutes} from '@shared'
import {WebSocketActions} from './websocket.actions'

@Injectable()
export class WebSocketEffects {
  private url = 'ws://localhost:3000'
  private websocket: WebSocket

  constructor(private actions$: Actions, private router: Router) {}

  connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.connect),
      switchMap(() => {
        return new Observable<Action>(observer => {
          this.websocket = new WebSocket(this.url)

          this.websocket.onopen = () => observer.next(WebSocketActions.opened())
          this.websocket.onclose = event =>
            observer.next(WebSocketActions.closed({reason: event.reason}))
          this.websocket.onerror = () => observer.next(WebSocketActions.error())
          this.websocket.onmessage = event => {
            const message = JSON.parse(event.data) as SocketMessage<any>
            observer.next(
              WebSocketActions.message({messageType: message.type, payload: message.payload})
            )
          }
        })
      })
    )
  )

  opened$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebSocketActions.opened),
        tap(() => {
          this.router.navigate([AdminClientRoutes.Home])
        })
      ),
    {dispatch: false}
  )

  sendMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebSocketActions.send),
        tap(({messageType, payload}) => {
          const messsage: SocketMessage<any> = {type: messageType, payload}
          this.websocket.send(JSON.stringify(messsage))
        })
      ),
    {dispatch: false}
  )
}
