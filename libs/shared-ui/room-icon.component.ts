import {Component, Input} from '@angular/core'

import {Room} from '@libs/schema'

@Component({
  selector: 'app-room-icon',
  template: ` <div [title]="room?.name" [class.highlighted]="highlighted">
    <span>{{ room?.name.charAt(0).toUpperCase() }}</span>
  </div>`,
  styleUrls: ['room-icon.component.sass'],
})
export class RoomIconComponent {
  @Input() room: Room
  @Input() highlighted: boolean
}
