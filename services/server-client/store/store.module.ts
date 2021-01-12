import {HttpClientModule} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {AuthEffects, authReducer} from './auth'
import {WebSocketEffects, websocketReducer} from './websocket'

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forRoot({auth: authReducer, websocket: websocketReducer}),
    EffectsModule.forRoot([AuthEffects, WebSocketEffects]),
  ],
  providers: [AuthEffects, WebSocketEffects],
})
export class RootStoreModule {}
