import {CanActivate, Router} from '@angular/router'
import {Store} from '@ngrx/store'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'

import {AuthSelectors} from '@store'
import {UserClientRoutes} from '@shared'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.state).pipe(
      map(state => {
        if (!state.username) this.router.navigate([UserClientRoutes.SignIn])
        return !!state.username
      })
    )
  }
}
