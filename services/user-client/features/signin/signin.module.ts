import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import {SigninComponent} from './signin.component'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: SigninComponent}]),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [SigninComponent],
})
export class SigninModule {}
