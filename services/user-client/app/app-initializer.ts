import {createSelector, Store} from '@ngrx/store'
import {first, skipWhile, tap} from 'rxjs/operators'

import {LoadStatus} from '@libs/client-utils'
import {AuthActions, AuthSelectors, WebSocketSelectors} from '@store'

const initialized = createSelector(
  AuthSelectors.state,
  WebSocketSelectors.state,
  (auth, websocket) => {
    if (auth.status.status === LoadStatus.Error) return true

    const isAuthInitialized = auth.status.status === LoadStatus.Loaded
    const isWebSocketInitialized =
      websocket.status.status === LoadStatus.Loaded || websocket.status.status === LoadStatus.Error

    return isAuthInitialized && isWebSocketInitialized
  }
)

export const initApplication = (store: Store) => {
  return () =>
    new Promise(resolve => {
      store.dispatch(AuthActions.refreshToken())

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
