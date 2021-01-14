import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {WebSocketEffects, websocketReducer} from '@libs/client-utils'
import {AuthEffects, authReducer} from './auth'
import {RoomsEffects, roomsReducer} from './rooms'
import {UsersEffects, usersReducer, userRoomReducer} from './users'
import {LogsEffects, logsReducer} from './logs'

@NgModule({
  imports: [
    StoreModule.forRoot({
      auth: authReducer,
      websocket: websocketReducer,
      rooms: roomsReducer,
      users: usersReducer,
      userRooms: userRoomReducer,
      logs: logsReducer,
    }),
    EffectsModule.forRoot([AuthEffects, WebSocketEffects, RoomsEffects, UsersEffects, LogsEffects]),
  ],
  providers: [AuthEffects, WebSocketEffects, RoomsEffects, UsersEffects, LogsEffects],
})
export class RootStoreModule {}
