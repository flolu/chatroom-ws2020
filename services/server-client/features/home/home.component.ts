import {Component, ElementRef, ViewChild} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Actions, ofType} from '@ngrx/effects'
import {Store} from '@ngrx/store'
import {
    LogsActions, LogsSelectors, RoomsActions, RoomsSelectors, UsersActions, UsersSelectors
} from '@store'
import {debounceTime, takeWhile} from 'rxjs/operators'

import {Room} from '@libs/schema'

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
        <div *ngFor="let user of onlineUsers$ | async" class="user">
          <div class="content">
            <app-avatar [user]="user" [highlighted]="true"></app-avatar>
            <div class="name_and_room">
              <span>{{ user.username }}</span>
              <span class="room" *ngIf="user.room">{{ user.room.name }}</span>
            </div>
            <span
              *ngIf="warnId !== user.id"
              class="warn material-icons"
              (click)="startWarning(user.id)"
              title="Warn user"
              >warning</span
            >
            <span class="kick material-icons" (click)="kickUser(user.id)" title="Kick user"
              >wifi_off</span
            >
            <span (click)="banUser(user.id)" class="ban material-icons" title="Ban user">
              report
            </span>
          </div>
          <div class="warn-container">
            <input
              *ngIf="warnId === user.id"
              [(ngModel)]="warnMessage"
              placeholder="Send a warning to this user"
            />
            <button *ngIf="warnId === user.id" (click)="warnUser(user.id)">Send warning</button>
          </div>
        </div>

        <div *ngFor="let user of offlineUsers$ | async" class="user">
          <div class="content">
            <app-avatar [user]="user" [highlighted]="false"></app-avatar>
            <div class="name_and_room">
              <span>{{ user.username }}</span>
            </div>
            <span
              *ngIf="!user.isBanned"
              (click)="banUser(user.id)"
              class="ban material-icons"
              title="Ban user"
            >
              report
            </span>
          </div>
        </div>
      </div>
    </div>
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
