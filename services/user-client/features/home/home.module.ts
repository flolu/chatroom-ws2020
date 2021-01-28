import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RouterModule} from '@angular/router'

import {SharedUIModule} from '@libs/shared-ui'

import {HomeComponent} from './home.component'
import {RoomsCopmonent} from './rooms.component'
import {SidePanelComponent} from './side-panel.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: HomeComponent}]),
    SharedUIModule,
  ],
  declarations: [HomeComponent, RoomsCopmonent, SidePanelComponent],
})
export class HomeModule {}
