import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {Actions, ofType} from '@ngrx/effects'
import {tap} from 'rxjs/operators'

import {WebSocketActions} from '@libs/client-utils'
import {UserClientRoutes} from '@shared'

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  styleUrls: ['app.component.sass'],
})
export class AppComponent {
  constructor(private actions$: Actions, private router: Router) {
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
