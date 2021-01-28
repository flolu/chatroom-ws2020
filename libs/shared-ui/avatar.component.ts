import {Component, Input} from '@angular/core'

import {PublicUser} from '@libs/schema'

@Component({
  selector: 'app-avatar',
  template: ` <div [title]="user?.username" [class.online]="online">
    <span>{{ user?.username.charAt(0).toUpperCase() }}</span>
  </div>`,
  styleUrls: ['avatar.component.sass'],
})
export class AvatarComponent {
  @Input() user: PublicUser
  @Input() online: boolean
}
