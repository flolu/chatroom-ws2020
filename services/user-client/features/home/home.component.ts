import {Component} from '@angular/core'
import {Store} from '@ngrx/store'

import {PushActions, PushSelectors, RoomsSelectors} from '@store'

@Component({
  selector: 'app-home',
  template: `
    <h2>User Client Home</h2>
    <div *ngIf="warnMessage$ | async as message">
      <h3>Warning from Admin</h3>
      <p>{{ message }}</p>
      <button (click)="warnMessageRead()">Ok</button>
    </div>

    <h3>Rooms</h3>
    <div *ngFor="let room of rooms$ | async">
      <span>{{ room.name }}</span>
    </div>

    <h3>Chat for Room ___</h3>
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
  warnMessage$ = this.store.select(PushSelectors.warnMessage)
  rooms$ = this.store.select(RoomsSelectors.all)

  constructor(private store: Store) {}

  warnMessageRead() {
    this.store.dispatch(PushActions.readWarnMessage())
  }
}
