import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import {HomeComponent} from './home.component'
import {AvatarComponent} from './avatar.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: HomeComponent}]),
  ],
  declarations: [HomeComponent, AvatarComponent],
})
export class HomeModule {}
