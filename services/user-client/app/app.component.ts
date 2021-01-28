import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {Actions, ofType} from '@ngrx/effects'
import {Store} from '@ngrx/store'
import {UserClientRoutes} from '@shared'
import {tap} from 'rxjs/operators'

import {WebSocketActions, WebSocketSelectors} from '@libs/client-utils'

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
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
