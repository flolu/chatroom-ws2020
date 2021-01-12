import {HttpClientModule} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {EffectsModule} from '@ngrx/effects'
import {StoreModule} from '@ngrx/store'

import {authReducer, AuthEffects} from './auth'

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forRoot({auth: authReducer}),
    EffectsModule.forRoot([AuthEffects]),
  ],
  providers: [AuthEffects],
})
export class RootStoreModule {}
