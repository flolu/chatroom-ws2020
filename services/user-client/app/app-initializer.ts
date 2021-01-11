import {Store} from '@ngrx/store'
import {first, skipWhile, tap} from 'rxjs/operators'

import {LoadStatus} from '@libs/client-utils'
import {AuthActions, AuthSelectors} from '@store'

export const initApplication = (store: Store) => {
  return () =>
    new Promise(resolve => {
      store.dispatch(AuthActions.refreshToken())
      store
        .select(AuthSelectors.state)
        .pipe(
          skipWhile(state => {
            if (!state) return true
            const {status} = state.status
            const skip = status === LoadStatus.None || status === LoadStatus.Loading
            return skip
          }),
          first(),
          tap(() => resolve(null))
        )
        .subscribe()
    })
}
