import {Component} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Store} from '@ngrx/store'
import {RoomsActions, RoomsSelectors, UsersSelectors} from '@store'

import {Room} from '@libs/schema'

@Component({
  selector: 'app-rooms',
  template: `
    <div class="container">
      <form [formGroup]="form" (submit)="createRoom()">
        <input formControlName="name" placeholder="Room name" />
        <span class="create material-icons" (click)="createRoom()">add</span>
      </form>
      <div
        *ngFor="let room of rooms$ | async"
        class="room"
        (mouseenter)="hoverId = room.id"
        (mouseleave)="hoverId = ''"
      >
        <span *ngIf="room.isPrivate" class="icon material-icons"> lock </span>
        <span *ngIf="!room.isPrivate" class="icon material-icons"> chat </span>
        <span *ngIf="editableRoomId !== room.id" class="name">
          <span *ngIf="!room.isPrivate">{{ room.name }}</span>
          <ng-container *ngIf="userEntities$ | async as users">
            <span *ngIf="room.isPrivate">
              Private chat of
              <strong>{{ users[room.privateSettings.privateUser1Id].username }}</strong> and
              <strong>{{ users[room.privateSettings.privateUser2Id].username }}</strong>
            </span>
          </ng-container>
        </span>

        <input
          *ngIf="editableRoomId === room.id"
          [(ngModel)]="editableRoomName"
          (keyup.enter)="editRoom()"
        />

        <ng-container *ngIf="hoverId === room.id && !room.isPrivate">
          <span class="spacer"></span>
          <span
            *ngIf="editableRoomId === room.id"
            (click)="editRoom()"
            class="confirm material-icons"
          >
            check
          </span>
          <span
            *ngIf="editableRoomId !== room.id"
            (click)="startEditRoom(room)"
            class="edit material-icons"
          >
            create
          </span>
          <span (click)="deleteRoom(room.id)" class="delete material-icons">delete</span>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['rooms.component.sass'],
})
export class RoomsComponent {
  rooms$ = this.store.select(RoomsSelectors.all)
  userEntities$ = this.store.select(UsersSelectors.entities)
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })
  editableRoomId: string
  editableRoomName: string
  hoverId = ''

  constructor(private store: Store) {}

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
}
