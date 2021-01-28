import {Component} from '@angular/core'

@Component({
  selector: 'app-home',
  template: `
    <app-side-panel></app-side-panel>
    <app-content></app-content>
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {}
