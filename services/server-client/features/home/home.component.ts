import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Component} from '@angular/core'
import {Store} from '@ngrx/store'

import {Room} from '@libs/schema'
import {RoomsActions, RoomsSelectors} from '@store'

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
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
  rooms$ = this.store.select(RoomsSelectors.all)

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })
  editableRoomId: string
  editableRoomName: string

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
}
