import {Component} from '@angular/core'
import {Store} from '@ngrx/store'

import {PushActions, PushSelectors} from '@store'

@Component({
  selector: 'app-home',
  template: `
    <h2>User Client Home</h2>
    <div *ngIf="warnMessage$ | async as message">
      <h3>Warning from Admin</h3>
      <p>{{ message }}</p>
      <button (click)="warnMessageRead()">Ok</button>
    </div>
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
  warnMessage$ = this.store.select(PushSelectors.warnMessage)

  constructor(private store: Store) {}

  warnMessageRead() {
    this.store.dispatch(PushActions.readWarnMessage())
  }
}
