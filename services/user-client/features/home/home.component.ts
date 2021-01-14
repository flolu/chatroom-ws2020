import {Component} from '@angular/core'
import {Store} from '@ngrx/store'

import {PushActions, PushSelectors, RoomsActions, RoomsSelectors} from '@store'

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
      <span (click)="joinRoom(room.id)">{{ room.name }}</span>
    </div>

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
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
  warnMessage$ = this.store.select(PushSelectors.warnMessage)
  rooms$ = this.store.select(RoomsSelectors.all)
  activeRoom$ = this.store.select(RoomsSelectors.activeRoom)
  onlineUsers$ = this.store.select(RoomsSelectors.onlineUsers)
  offlineUsers$ = this.store.select(RoomsSelectors.offlineUsers)
  messages$ = this.store.select(RoomsSelectors.messagesWithUser)

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
