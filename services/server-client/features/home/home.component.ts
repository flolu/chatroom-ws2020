import {Component} from '@angular/core'

@Component({
  selector: 'app-home',
  template: `
    <div class="top">
      <app-rooms class="rooms"></app-rooms>
      <app-users class="users"></app-users>
    </div>
    <app-logs class="logs"></app-logs>
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {}
