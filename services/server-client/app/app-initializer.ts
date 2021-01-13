import {Store} from '@ngrx/store'
import {first, skipWhile} from 'rxjs/operators'

import {WebSocketActions, WebSocketSelectors} from '@libs/client-utils'
import {AuthActions, AuthSelectors} from '@store'

const adminSecret = 'lOINo6JX6y1iKSEx0NJ0XdFlhUvtCeGt'

export const initApplication = (store: Store) => {
  return () =>
    new Promise(resolve => {
      store.dispatch(WebSocketActions.connect())
      store
        .select(WebSocketSelectors.initialized)
        .pipe(
          skipWhile(initialized => !initialized),
          first()
        )
        .subscribe(() => {
          store.dispatch(AuthActions.authenticate({secret: adminSecret}))
          store
            .select(AuthSelectors.initialized)
            .pipe(
              skipWhile(initialized => !initialized),
              first()
            )
            .subscribe(() => resolve(null))
        })
    })
}
