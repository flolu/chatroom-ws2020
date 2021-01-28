import {Component} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthSelectors, PushActions, PushSelectors, RoomsActions} from '@store'

import {WebSocketSelectors} from '@libs/client-utils'

@Component({
  selector: 'app-side-panel',
  template: `
    <!-- TODO redesign

    <div class="status">
      <div class="connection">
        <span class="indicator good material-icons" *ngIf="isConnected$ | async">wifi</span>
        <span class="indicator bad material-icons" *ngIf="!(isConnected$ | async)">wifi_off</span>
        <span>Connection</span>
      </div>

      <div *ngIf="warnMessage$ | async as message" class="warning">
        <div class="title">
          <span>You've got a warning from the admin</span>
          <span class="close material-icons" (click)="warnMessageRead()">clear</span>
        </div>
        <p>{{ message }}</p>
      </div>

      <div *ngIf="connectionError$ | async" class="error">{{ connectionError$ | async }}</div>
      <div *ngIf="!(isConnected$ | async) && !(connectionError$ | async)" class="error">
        Disconnected. Try to reload
      </div>
    </div>

    <div class="user" *ngIf="user$ | async as user">
      <div class="avatar">
        <span>{{ user.username.charAt(0).toUpperCase() }}</span>
      </div>
      <div class="username">{{ user.username }}</div>
    </div>
 -->
    <app-rooms></app-rooms>

    <div class="create_room_spacer"></div>
    <div class="create_room">
      <input
        placeholder="Partner Username"
        [(ngModel)]="parnterUsername"
        (keyup.enter)="createPrivateRoom()"
      />
      <button (click)="createPrivateRoom()">Create Private Room</button>
    </div>
  `,
  styleUrls: ['side-panel.component.sass'],
})
export class SidePanelComponent {
  isConnected$ = this.store.select(WebSocketSelectors.isConnected)
  connectionError$ = this.store.select(WebSocketSelectors.error)
  warnMessage$ = this.store.select(PushSelectors.warnMessage)
  user$ = this.store.select(AuthSelectors.user)
  parnterUsername = ''

  constructor(private store: Store) {}

  warnMessageRead() {
    this.store.dispatch(PushActions.readWarnMessage())
  }

  createPrivateRoom() {
    this.store.dispatch(RoomsActions.createPrivate({username: this.parnterUsername}))
    this.parnterUsername = ''
  }
}
