import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core'
import {Actions, ofType} from '@ngrx/effects'
import {Store} from '@ngrx/store'
import {AuthSelectors, RoomsActions, RoomsSelectors} from '@store'
import {debounceTime, takeWhile} from 'rxjs/operators'

@Component({
  selector: 'app-content',
  template: `
    <ng-container *ngIf="activeRoom$ | async as room">
      <div class="info">
        <div class="description">
          <div class="name">
            <span *ngIf="room.isPrivate">{{ (partner$ | async)?.username }}</span>
            <span *ngIf="!room.isPrivate">{{ room.name }}</span>
          </div>
          <div class="type">
            <span *ngIf="room.isPrivate">Private Chat</span>
            <span *ngIf="!room.isPrivate">Group Chat</span>
          </div>
        </div>

        <div class="spacer"></div>
        <div class="close" *ngIf="room.isPrivate">
          <button (click)="closeRoom(room.id)">Close Room</button>
        </div>
        <div class="users">
          <app-avatar
            *ngFor="let user of onlineUsers$ | async"
            class="avatar online"
            [user]="user"
            [highlighted]="true"
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
            <div class="message_and_time">
              <div class="message">{{ message.message }}</div>
              <span class="time">{{ message.timestamp | date: 'shortTime' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="input">
        <input
          [(ngModel)]="messageInput"
          (keyup.enter)="sendMessage()"
          placeholder="Write a message"
        />
        <span class="send material-icons" (click)="sendMessage()" [class.sendable]="!!messageInput">
          send
        </span>
      </div>
    </ng-container>

    <div *ngIf="!(activeRoom$ | async)" class="no_room_selected">
      <span class="material-icons icon">chat</span>
      <span class="text">No chat selected</span>
      <span class="sub_text">Choose a group or private chat</span>
    </div>
  `,
  styleUrls: ['content.component.sass'],
})
export class ContentComponent implements OnDestroy {
  @ViewChild('messages') messagesEl: ElementRef<HTMLDivElement>

  activeRoom$ = this.store.select(RoomsSelectors.activeRoom)
  activeRoomId$ = this.store.select(RoomsSelectors.activeRoomId)
  onlineUsers$ = this.store.select(RoomsSelectors.onlineUsers)
  offlineUsers$ = this.store.select(RoomsSelectors.offlineUsers)
  messages$ = this.store.select(RoomsSelectors.selectedMessagesWithUser)
  user$ = this.store.select(AuthSelectors.user)
  partner$ = this.store.select(RoomsSelectors.selectedPartner)
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

  sendMessage() {
    if (this.messageInput)
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
