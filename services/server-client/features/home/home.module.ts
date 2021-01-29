import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RouterModule} from '@angular/router'

import {SharedUIModule} from '@libs/shared-ui'

import {HomeComponent} from './home.component'
import {LogsComponent} from './logs.component'
import {RoomsComponent} from './rooms.component'
import {UsersComponent} from './users.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: HomeComponent}]),
    SharedUIModule,
  ],
  declarations: [HomeComponent, UsersComponent, LogsComponent, RoomsComponent],
})
export class HomeModule {}
