import {CanActivate, Router} from '@angular/router'
import {Store} from '@ngrx/store'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'

import {AuthSelectors} from '@store'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.state).pipe(
      map(state => {
        // TODO don't hardcode
        if (!state.username) this.router.navigate(['signin'])
        return !!state.username
      })
    )
  }
}
