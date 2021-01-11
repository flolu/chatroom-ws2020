import {BrowserModule} from '@angular/platform-browser'
import {APP_INITIALIZER, NgModule} from '@angular/core'
import {Store} from '@ngrx/store'

import {AppComponent} from './app.component'
import {AppRoutingModule} from './app-routing.module'
import {initApplication} from './app-initializer'

@NgModule({
  imports: [BrowserModule, AppRoutingModule],
  declarations: [AppComponent],
  providers: [{provide: APP_INITIALIZER, useFactory: initApplication, multi: true, deps: [Store]}],
})
export class AppBaseModule {}
