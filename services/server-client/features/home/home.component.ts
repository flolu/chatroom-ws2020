import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Component} from '@angular/core'
import {Store} from '@ngrx/store'

import {WebSocketActions} from '@libs/client-utils'
import {IncomingServerMessageType} from '@libs/enums'
import {CreateRoom} from '@libs/schema'

@Component({
  selector: 'app-home',
  template: `
    <h2>Server Client Home</h2>
    <form [formGroup]="form" (submit)="createRoom()">
      <input formControlName="name" placeholder="Room name" />
      <button [disabled]="!form.valid">Create Room</button>
    </form>
  `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })

  constructor(private store: Store) {}

  createRoom() {
    const payload: CreateRoom = {name: this.form.value.name}
    this.store.dispatch(
      WebSocketActions.send({
        messageType: IncomingServerMessageType.CreateRoom,
        payload,
      })
    )
  }
}
