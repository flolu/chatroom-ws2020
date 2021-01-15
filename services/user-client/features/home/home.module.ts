import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import {SharedUIModule} from '@libs/shared-ui'
import {HomeComponent} from './home.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: HomeComponent}]),
    SharedUIModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
