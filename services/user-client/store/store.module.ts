import {HttpClientModule} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {authReducer, AuthEffects} from './auth'
import {websocketReducer, WebSocketEffects} from './websocket'

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forRoot({auth: authReducer, websocket: websocketReducer}),
    EffectsModule.forRoot([AuthEffects, WebSocketEffects]),
  ],
  providers: [AuthEffects, WebSocketEffects],
})
export class RootStoreModule {}
