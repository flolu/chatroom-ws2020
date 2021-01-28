import {Component} from '@angular/core'
import {Store} from '@ngrx/store'
import {RoomsActions, RoomsSelectors} from '@store'

@Component({
  selector: 'app-rooms',
  template: `
    <div
      *ngFor="let item of rooms$ | async"
      class="item"
      [class.selected]="(activeRoomId$ | async) === item.room.id"
      (click)="joinRoom(item.room.id)"
    >
      <app-avatar *ngIf="item.room.isPrivate" [user]="item.partner" [invserse]="true"> </app-avatar>
      <app-room-icon
        *ngIf="!item.room.isPrivate"
        [room]="item.room"
        [invserse]="true"
      ></app-room-icon>
      <div class="info">
        <span class="name">{{ item.room.name }}</span>
        <span class="message">{{ item.lastMessage?.message }}</span>
      </div>
    </div>
  `,
  styleUrls: ['rooms.component.sass'],
})
export class RoomsCopmonent {
  rooms$ = this.store.select(RoomsSelectors.roomsWithMetadata)
  activeRoomId$ = this.store.select(RoomsSelectors.activeRoomId)

  constructor(private store: Store) {}

  joinRoom(id: string) {
    this.store.dispatch(RoomsActions.join({id}))
  }
}
