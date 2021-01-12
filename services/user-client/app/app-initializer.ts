import {Store} from '@ngrx/store'
import {first, skipWhile, tap} from 'rxjs/operators'

import {LoadStatus} from '@libs/client-utils'
import {AuthActions, WebSocketSelectors} from '@store'

export const initApplication = (store: Store) => {
  return () =>
    new Promise(resolve => {
      store.dispatch(AuthActions.refreshToken())
      store
        .select(WebSocketSelectors.state)
        .pipe(
          skipWhile(websocketState => {
            const skip =
              websocketState.status.status === LoadStatus.None ||
              websocketState.status.status === LoadStatus.Loading
            return skip
          }),
          first(),
          tap(() => resolve(null))
        )
        .subscribe()
    })
}
