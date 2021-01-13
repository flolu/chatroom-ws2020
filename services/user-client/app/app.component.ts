import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {Actions, ofType} from '@ngrx/effects'
import {tap} from 'rxjs/operators'
import {Store} from '@ngrx/store'

import {WebSocketActions, WebSocketSelectors} from '@libs/client-utils'
import {UserClientRoutes} from '@shared'

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="!(isConnected$ | async)">Disconnected from server. Please reload!</div>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.sass'],
})
export class AppComponent {
  isConnected$ = this.store.select(WebSocketSelectors.isConnected)

  constructor(private actions$: Actions, private router: Router, private store: Store) {
    this.actions$
      .pipe(
        ofType(WebSocketActions.opened),
        tap(() => {
          this.router.navigate([UserClientRoutes.Home])
        })
      )
      .subscribe()
  }
}
