import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {WebSocketEffects, websocketReducer} from '@libs/client-utils'
import {AuthEffects, authReducer} from './auth'
import {RoomsEffects, roomsReducer} from './rooms'

@NgModule({
  imports: [
    StoreModule.forRoot({auth: authReducer, websocket: websocketReducer, rooms: roomsReducer}),
    EffectsModule.forRoot([AuthEffects, WebSocketEffects, RoomsEffects]),
  ],
  providers: [AuthEffects, WebSocketEffects, RoomsEffects],
})
export class RootStoreModule {}
