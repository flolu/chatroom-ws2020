import {Component, ElementRef, ViewChild} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Actions, ofType} from '@ngrx/effects'
import {Store} from '@ngrx/store'
import {LogsActions, LogsSelectors, RoomsActions, RoomsSelectors, UsersSelectors} from '@store'
import {debounceTime, takeWhile} from 'rxjs/operators'

import {Room} from '@libs/schema'

@Component({
  selector: 'app-home',
  template: `
    <div class="top">
      <app-rooms class="rooms"></app-rooms>
      <app-users class="users"></app-users>
    </div>
    <app-logs class="logs"></app-logs>

    <!-- <div class="container">
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

    </div> -->
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

  private scrollToBottom() {
    if (this.logsEl) this.logsEl.nativeElement.scrollTop = this.logsEl.nativeElement.scrollHeight
  }
}
