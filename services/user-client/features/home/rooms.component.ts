import {Component} from '@angular/core'
import {Store} from '@ngrx/store'
import {RoomsActions, RoomsSelectors} from '@store'

@Component({
  selector: 'app-rooms',
  template: `
    <input placeholder="Partner Username" [(ngModel)]="parnterUsername" />
    <button (click)="createPrivateRoom()">Create Private Room</button>
    <div
      *ngFor="let room of private$ | async"
      class="item"
      [class.selected]="(activeRoomId$ | async) === room.id"
      (click)="joinRoom(room.id)"
    >
      <span>{{ room.name }}</span>
    </div>
    <div
      *ngFor="let room of public$ | async"
      class="item"
      [class.selected]="(activeRoomId$ | async) === room.id"
      (click)="joinRoom(room.id)"
    >
      <span>{{ room.name }}</span>
    </div>
  `,
  styleUrls: ['rooms.component.sass'],
})
export class RoomsCopmonent {
  public$ = this.store.select(RoomsSelectors.publicRooms)
  private$ = this.store.select(RoomsSelectors.privateRooms)
  activeRoomId$ = this.store.select(RoomsSelectors.activeRoomId)
  parnterUsername = ''

  constructor(private store: Store) {}

  joinRoom(id: string) {
    this.store.dispatch(RoomsActions.join({id}))
  }

  createPrivateRoom() {
    this.store.dispatch(RoomsActions.createPrivate({username: this.parnterUsername}))
    this.parnterUsername = ''
  }
}
