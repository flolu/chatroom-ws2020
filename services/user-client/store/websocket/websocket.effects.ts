import {Injectable} from '@angular/core'
import {Action} from '@ngrx/store'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {switchMap, tap} from 'rxjs/operators'
import {Router} from '@angular/router'
import {Observable} from 'rxjs'

import {WebSocketService} from '@services'
import {UserClientRoutes} from '@shared'
import {WebSocketActions} from './websocket.actions'

@Injectable()
export class WebSocketEffects {
  constructor(
    private actions$: Actions,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

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

  opened$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebSocketActions.opened),
        tap(() => this.router.navigate([UserClientRoutes.Home]))
      ),
    {dispatch: false}
  )
}
