import {Injectable} from '@angular/core'
import {Action} from '@ngrx/store'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {switchMap} from 'rxjs/operators'
import {Observable} from 'rxjs'

import {WebSocketService} from '@services'
import {WebSocketActions} from './websocket.actions'

@Injectable()
export class WebSocketEffects {
  constructor(private actions$: Actions, private webSocketService: WebSocketService) {}

  connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.connect),
      switchMap(() => {
        return new Observable<Action>(observer => {
          const websocket = new WebSocket(this.webSocketService.url)
          this.webSocketService.websocket = websocket

          websocket.onopen = () => observer.next(WebSocketActions.opened())
          websocket.onclose = event =>
            observer.next(WebSocketActions.closed({reason: event.reason}))
          websocket.onerror = () => observer.next(WebSocketActions.error())
        })
      })
    )
  )
}
