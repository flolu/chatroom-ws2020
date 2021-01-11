import {Component} from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <h1>Chat</h1>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.sass'],
})
export class AppComponent {}
