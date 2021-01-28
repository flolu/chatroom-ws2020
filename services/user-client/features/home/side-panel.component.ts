import {Component} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthActions, AuthSelectors, PushActions, PushSelectors, RoomsActions} from '@store'

import {WebSocketSelectors} from '@libs/client-utils'

@Component({
  selector: 'app-side-panel',
  template: `
    <div class="status">
      <div *ngIf="warnMessage$ | async as message" class="warning">
        <div class="title">
          <span>You've got a warning from the admin</span>
          <span class="close material-icons" (click)="warnMessageRead()">clear</span>
        </div>
        <p>{{ message }}</p>
      </div>

      <div *ngIf="!(isConnected$ | async) || (connectionError$ | async)" class="error">
        <span class="indicator bad material-icons" *ngIf="!(isConnected$ | async)">wifi_off</span>
        <span> Disconnected</span>
      </div>
    </div>

    <div class="user" *ngIf="user$ | async as user">
      <app-avatar [user]="user" [highlighted]="true"></app-avatar>
      <div class="info">
        <div class="username">{{ user.username }}</div>
        <div class="signout" (click)="signOut()">Sign out</div>
      </div>
    </div>

    <app-rooms></app-rooms>

    <div class="create_room_spacer"></div>
    <div class="create_room">
      <input
        placeholder="Username"
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

  signOut() {
    this.store.dispatch(AuthActions.signOut())
  }
}
