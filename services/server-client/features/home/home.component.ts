import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Component, ElementRef, ViewChild} from '@angular/core'
import {Store} from '@ngrx/store'

import {Room} from '@libs/schema'
import {
  LogsActions,
  LogsSelectors,
  RoomsActions,
  RoomsSelectors,
  UsersActions,
  UsersSelectors,
} from '@store'
import {Actions, ofType} from '@ngrx/effects'
import {debounceTime, takeWhile} from 'rxjs/operators'

// TODO design users
@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <div class="logs" #logs>
        <pre>{{ logs$ | async | json }}</pre>
      </div>
      <div class="rooms">
        <h3>Rooms</h3>
        <form [formGroup]="form" (submit)="createRoom()">
          <input formControlName="name" placeholder="Room name" />
          <span class="create material-icons" (click)="createRoom()">add</span>
        </form>
        <div *ngFor="let room of rooms$ | async" class="room">
          <span *ngIf="editableRoomId !== room.id" class="name">{{ room.name }}</span>
          <input *ngIf="editableRoomId === room.id" [(ngModel)]="editableRoomName" />
          <span
            *ngIf="editableRoomId !== room.id"
            (click)="startEditRoom(room)"
            class="edit material-icons"
          >
            create
          </span>
          <span
            *ngIf="editableRoomId === room.id"
            (click)="editRoom()"
            class="confirm material-icons"
          >
            check
          </span>
          <span (click)="deleteRoom(room.id)" class="delete material-icons">delete</span>
        </div>
      </div>

      <div class="users">
        <h3>Users</h3>
      </div>
    </div>
    <!--
    <h3>Users</h3>
    <h4>Online</h4>
    <div *ngFor="let user of onlineUsers$ | async">
      <span>{{ user.username }}</span>
      <input
        *ngIf="warnId === user.id"
        [(ngModel)]="warnMessage"
        placeholder="Send a message to this user"
      />
      <button *ngIf="warnId !== user.id" (click)="startWarning(user.id)">Warn</button>
      <button *ngIf="warnId === user.id" (click)="warnUser(user.id)">Send</button>
      <button (click)="kickUser(user.id)">Kick</button>
      <button (click)="banUser(user.id)">Ban</button>
      <span *ngIf="user.room">In room {{ user.room.name }}</span>
      <span *ngIf="!user.room">In no room</span>
    </div>
    <h4>Offline</h4>
    <div *ngFor="let user of offlineUsers$ | async">
      <span>{{ user.username }}</span>
      <button *ngIf="!user.isBanned" (click)="banUser(user.id)">Ban</button>
      <span *ngIf="user.isBanned">User is banned</span>
    </div>


    -->
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
  @ViewChild('logs') logsEl: ElementRef<HTMLDivElement>

  rooms$ = this.store.select(RoomsSelectors.all)
  onlineUsers$ = this.store.select(UsersSelectors.onlineUsers)
  offlineUsers$ = this.store.select(UsersSelectors.offlineUsers)
  logs$ = this.store.select(LogsSelectors.all)
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })
  editableRoomId: string
  editableRoomName: string
  warnId: string
  warnMessage: string
  private alive = true

  constructor(private store: Store, private actions$: Actions) {
    this.actions$
      .pipe(
        takeWhile(() => this.alive),
        ofType(LogsActions.log),
        debounceTime(2)
      )
      .subscribe(() => this.scrollToBottom())
  }

  createRoom() {
    if (this.form.valid) {
      this.store.dispatch(RoomsActions.create({name: this.form.value.name}))
      this.form.patchValue({name: ''})
    }
  }

  startEditRoom(room: Room) {
    this.editableRoomName = room.name
    this.editableRoomId = room.id
  }

  editRoom() {
    if (this.editableRoomName.length >= 3) {
      this.store.dispatch(RoomsActions.edit({id: this.editableRoomId, name: this.editableRoomName}))
      this.editableRoomId = ''
    }
  }

  deleteRoom(id: string) {
    this.store.dispatch(RoomsActions.remove({id}))
  }

  startWarning(id: string) {
    this.warnId = id
    this.warnMessage = ''
  }

  warnUser(id: string) {
    this.store.dispatch(UsersActions.warn({id, message: this.warnMessage}))
    this.warnId = ''
  }

  kickUser(id: string) {
    this.store.dispatch(UsersActions.kick({id}))
  }

  banUser(id: string) {
    this.store.dispatch(UsersActions.ban({id}))
  }

  private scrollToBottom() {
    if (this.logsEl) this.logsEl.nativeElement.scrollTop = this.logsEl.nativeElement.scrollHeight
  }
}
