import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core'
import {Actions, ofType} from '@ngrx/effects'
import {Store} from '@ngrx/store'
import {AuthSelectors, PushActions, PushSelectors, RoomsActions, RoomsSelectors} from '@store'
import {debounceTime, takeWhile} from 'rxjs/operators'

import {WebSocketSelectors} from '@libs/client-utils'

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

        <app-rooms></app-rooms>
      </div>

      <div class="content" *ngIf="activeRoom$ | async as room">
        <div class="info">
          <div class="name">{{ room.name }}</div>
          <div class="close" *ngIf="room.isPrivate">
            <button (click)="closeRoom(room.id)">Close Room</button>
          </div>
          <div class="users">
            <app-avatar
              *ngFor="let user of onlineUsers$ | async"
              class="avatar online"
              [user]="user"
              [online]="true"
            >
            </app-avatar>
            <app-avatar
              *ngFor="let user of offlineUsers$ | async"
              class="avatar offline"
              [user]="user"
            >
            </app-avatar>
          </div>
        </div>

        <div class="messages" #messages>
          <div *ngFor="let message of messages$ | async" class="item">
            <div class="content" [class.right]="(user$ | async)!.id === message.fromId">
              <div class="username" *ngIf="(user$ | async)!.id !== message.fromId">
                {{ message.user.username }}
              </div>
              <div class="message">{{ message.message }}</div>
            </div>
          </div>
        </div>

        <div class="input">
          <input
            [(ngModel)]="messageInput"
            (keyup.enter)="sendMessage()"
            placeholder="Write a message"
          />
          <span class="send material-icons" (click)="sendMessage()"> send </span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent implements OnDestroy {
  @ViewChild('messages') messagesEl: ElementRef<HTMLDivElement>

  isConnected$ = this.store.select(WebSocketSelectors.isConnected)
  connectionError$ = this.store.select(WebSocketSelectors.error)
  warnMessage$ = this.store.select(PushSelectors.warnMessage)
  activeRoom$ = this.store.select(RoomsSelectors.activeRoom)
  activeRoomId$ = this.store.select(RoomsSelectors.activeRoomId)
  onlineUsers$ = this.store.select(RoomsSelectors.onlineUsers)
  offlineUsers$ = this.store.select(RoomsSelectors.offlineUsers)
  messages$ = this.store.select(RoomsSelectors.messagesWithUser)
  user$ = this.store.select(AuthSelectors.user)
  messageInput = ''
  private alive = true

  constructor(private store: Store, private actions$: Actions) {
    this.actions$
      .pipe(
        takeWhile(() => this.alive),
        ofType(RoomsActions.incomingMessage),
        debounceTime(2)
      )
      .subscribe(() => this.scrollToBottom())

    this.actions$
      .pipe(
        takeWhile(() => this.alive),
        ofType(RoomsActions.joined),
        debounceTime(2)
      )
      .subscribe(() => this.scrollToBottom())
  }

  private scrollToBottom() {
    if (this.messagesEl)
      this.messagesEl.nativeElement.scrollTop = this.messagesEl.nativeElement.scrollHeight
  }

  warnMessageRead() {
    this.store.dispatch(PushActions.readWarnMessage())
  }

  sendMessage() {
    this.store.dispatch(RoomsActions.sendMessage({message: this.messageInput}))
    this.messageInput = ''
  }

  closeRoom(id: string) {
    this.store.dispatch(RoomsActions.closePrivate({id}))
  }

  ngOnDestroy() {
    this.alive = false
  }
}
