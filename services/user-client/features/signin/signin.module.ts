import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {StoreModule} from '@ngrx/store'

import {SigninComponent} from './signin.component'
import {signInReducer} from './signin.reducer'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: SigninComponent}]),
    StoreModule.forFeature('signin', {page: signInReducer}),
  ],
  declarations: [SigninComponent],
})
export class SigninModule {}
