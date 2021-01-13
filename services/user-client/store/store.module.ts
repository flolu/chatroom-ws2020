import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {WebSocketEffects, websocketReducer} from '@libs/client-utils'
import {authReducer, AuthEffects} from './auth'
import {PushEffects, pushReducer} from './push'

@NgModule({
  imports: [
    StoreModule.forRoot({auth: authReducer, websocket: websocketReducer, push: pushReducer}),
    EffectsModule.forRoot([AuthEffects, WebSocketEffects, PushEffects]),
  ],
  providers: [AuthEffects, WebSocketEffects, PushEffects],
})
export class RootStoreModule {}
