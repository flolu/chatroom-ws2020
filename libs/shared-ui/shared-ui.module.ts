import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'

import {AvatarComponent} from './avatar.component'
import {RoomIconComponent} from './room-icon.component'

@NgModule({
  imports: [CommonModule],
  declarations: [AvatarComponent, RoomIconComponent],
  exports: [AvatarComponent, RoomIconComponent],
})
export class SharedUIModule {}
