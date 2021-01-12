import {HttpClientModule} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {WebSocketEffects, websocketReducer} from '@libs/client-utils'
import {authReducer, AuthEffects} from './auth'

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forRoot({auth: authReducer, websocket: websocketReducer}),
    EffectsModule.forRoot([AuthEffects, WebSocketEffects]),
  ],
  providers: [AuthEffects, WebSocketEffects],
})
export class RootStoreModule {}
