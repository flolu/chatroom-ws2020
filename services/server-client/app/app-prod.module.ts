import {NgModule} from '@angular/core'

import {RootStoreModule} from '@store'
import {AppComponent} from './app.component'
import {AppBaseModule} from './app-base.module'

@NgModule({
  imports: [AppBaseModule, RootStoreModule],
  bootstrap: [AppComponent],
})
export class AppProdModule {
  constructor() {
    console.log(`🚀 Launching production app`)
  }
}
