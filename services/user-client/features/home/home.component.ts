import {Component} from '@angular/core'
import {Store} from '@ngrx/store'

import {WebSocketSelectors} from '@libs/client-utils'
import {AuthSelectors, PushActions, PushSelectors, RoomsActions, RoomsSelectors} from '@store'

@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <div class="panel">
        <div class="status">
          <div class="connection">
            <span class="indicator good material-icons" *ngIf="isConnected$ | async">wifi</span>
            <span class="indicator bad material-icons" *ngIf="!(isConnected$ | async)"
              >wifi_off</span
            >
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

        <div class="rooms">
          <div
            *ngFor="let room of rooms$ | async"
            class="item"
            [class.selected]="(activeRoomId$ | async) === room.id"
            (click)="joinRoom(room.id)"
          >
            <span>{{ room.name }}</span>
          </div>
        </div>
      </div>

      <div class="content">
        <ng-container *ngIf="activeRoom$ | async as room">
          <h3>Chat for Room {{ room.name }}</h3>
          <h4>Online Users</h4>
          <div *ngFor="let user of onlineUsers$ | async">{{ user.username }}</div>
          <h4>Offline Users</h4>
          <div *ngFor="let user of offlineUsers$ | async">{{ user.username }}</div>
          <h4>Messages</h4>
          <div *ngFor="let message of messages$ | async">
            {{ message.user.username }}: {{ message.message }}
          </div>
          <input [(ngModel)]="messageInput" placeholder="Write a message" />
          <button (click)="sendMessage()">Send</button>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
  isConnected$ = this.store.select(WebSocketSelectors.isConnected)
  connectionError$ = this.store.select(WebSocketSelectors.error)
  warnMessage$ = this.store.select(PushSelectors.warnMessage)
  rooms$ = this.store.select(RoomsSelectors.all)
  activeRoom$ = this.store.select(RoomsSelectors.activeRoom)
  activeRoomId$ = this.store.select(RoomsSelectors.activeRoomId)
  onlineUsers$ = this.store.select(RoomsSelectors.onlineUsers)
  offlineUsers$ = this.store.select(RoomsSelectors.offlineUsers)
  messages$ = this.store.select(RoomsSelectors.messagesWithUser)
  user$ = this.store.select(AuthSelectors.user)

  messageInput = ''

  constructor(private store: Store) {}

  warnMessageRead() {
    this.store.dispatch(PushActions.readWarnMessage())
  }

  joinRoom(id: string) {
    this.store.dispatch(RoomsActions.join({id}))
  }

  sendMessage() {
    this.store.dispatch(RoomsActions.sendMessage({message: this.messageInput}))
    this.messageInput = ''
  }
}
