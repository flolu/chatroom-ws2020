import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Component} from '@angular/core'
import {Store} from '@ngrx/store'

import {Room} from '@libs/schema'
import {LogsSelectors, RoomsActions, RoomsSelectors, UsersActions, UsersSelectors} from '@store'

@Component({
  selector: 'app-home',
  template: `
    <h2>Server Client Home</h2>
    <h3>Rooms</h3>
    <form [formGroup]="form" (submit)="createRoom()">
      <input formControlName="name" placeholder="Room name" />
      <button [disabled]="!form.valid">Create Room</button>
    </form>
    <div *ngFor="let room of rooms$ | async">
      <span *ngIf="editableRoomId !== room.id">{{ room.name }}</span>
      <input *ngIf="editableRoomId === room.id" [(ngModel)]="editableRoomName" />
      <button *ngIf="editableRoomId !== room.id" (click)="startEditRoom(room)">Edit</button>
      <button *ngIf="editableRoomId === room.id" (click)="editRoom()">Confirm</button>
      <button (click)="deleteRoom(room.id)">Delete</button>
    </div>

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

    <h3>Logs</h3>
    <pre>{{ logs$ | async | json }}</pre>
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
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

  constructor(private store: Store) {}

  createRoom() {
    this.store.dispatch(RoomsActions.create({name: this.form.value.name}))
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
}
