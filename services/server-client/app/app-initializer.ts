import {createSelector, Store} from '@ngrx/store'
import {first, skipWhile, tap} from 'rxjs/operators'

import {LoadStatus, WebSocketSelectors} from '@libs/client-utils'
import {AuthActions, AuthSelectors} from '@store'

const initialized = createSelector(
  AuthSelectors.state,
  WebSocketSelectors.state,
  (auth, websocket) => {
    if (auth.status.status === LoadStatus.Error) return true

    const isAuthInitialized = auth.status.status === LoadStatus.Loaded
    const isWebSocketInitialized =
      websocket.status &&
      (websocket.status.status === LoadStatus.Loaded ||
        websocket.status.status === LoadStatus.Error)

    return isAuthInitialized && isWebSocketInitialized
  }
)

const adminSecret = 'lOINo6JX6y1iKSEx0NJ0XdFlhUvtCeGt'
export const initApplication = (store: Store) => {
  return () =>
    new Promise(resolve => {
      store.dispatch(AuthActions.authenticate({secret: adminSecret}))

      store
        .select(initialized)
        .pipe(
          skipWhile(initialized => !initialized),
          first(),
          tap(() => resolve(null))
        )
        .subscribe()
    })
}
