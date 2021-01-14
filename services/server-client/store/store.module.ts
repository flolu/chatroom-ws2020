import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {WebSocketEffects, websocketReducer} from '@libs/client-utils'
import {AuthEffects, authReducer} from './auth'
import {RoomsEffects, roomsReducer} from './rooms'
import {UsersEffects, usersReducer, userRoomReducer} from './users'

@NgModule({
  imports: [
    StoreModule.forRoot({
      auth: authReducer,
      websocket: websocketReducer,
      rooms: roomsReducer,
      users: usersReducer,
      userRooms: userRoomReducer,
    }),
    EffectsModule.forRoot([AuthEffects, WebSocketEffects, RoomsEffects, UsersEffects]),
  ],
  providers: [AuthEffects, WebSocketEffects, RoomsEffects, UsersEffects],
})
export class RootStoreModule {}
