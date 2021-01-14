import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {WebSocketEffects, websocketReducer} from '@libs/client-utils'
import {authReducer, AuthEffects} from './auth'
import {PushEffects, pushReducer} from './push'
import {RoomsEffects, roomsReducer} from './rooms'
import {usersReducer} from './users'

@NgModule({
  imports: [
    StoreModule.forRoot({
      auth: authReducer,
      websocket: websocketReducer,
      push: pushReducer,
      rooms: roomsReducer,
      users: usersReducer,
    }),
    EffectsModule.forRoot([AuthEffects, WebSocketEffects, PushEffects, RoomsEffects]),
  ],
  providers: [AuthEffects, WebSocketEffects, PushEffects, RoomsEffects],
})
export class RootStoreModule {}
