import {NgModule} from '@angular/core'
import {StoreDevtoolsModule} from '@ngrx/store-devtools'

import {RootStoreModule} from '@store'
import {AppBaseModule} from './app-base.module'
import {AppComponent} from './app.component'

@NgModule({
  imports: [AppBaseModule, RootStoreModule, StoreDevtoolsModule.instrument()],
  bootstrap: [AppComponent],
})
export class AppDevModule {
  constructor() {
    console.log(`🛠️ Launching development app`)
  }
}
