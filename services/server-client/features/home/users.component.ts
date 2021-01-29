import {Component} from '@angular/core'
import {Store} from '@ngrx/store'
import {UsersActions, UsersSelectors} from '@store'

@Component({
  selector: 'app-users',
  template: `
    <div class="container">
      <ng-container *ngFor="let user of onlineUsers$ | async">
        <div class="content" (mouseenter)="hoverId = user.id" (mouseleave)="hoverId = ''">
          <app-avatar [user]="user" [highlighted]="true"></app-avatar>
          <div class="name_and_room">
            <span>{{ user.username }}</span>
            <span class="room" *ngIf="user.room">{{ user.room.name }}</span>
          </div>
          <ng-container *ngIf="hoverId === user.id">
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
          </ng-container>
        </div>
        <div class="warn-container" *ngIf="warnId === user.id">
          <input
            [(ngModel)]="warnMessage"
            placeholder="Send a warning to this user"
            (keyup.enter)="warnUser(user.id)"
          />
          <button *ngIf="warnId === user.id" (click)="warnUser(user.id)">Send</button>
        </div>
      </ng-container>

      <div
        *ngFor="let user of offlineUsers$ | async"
        class="content"
        [class.banned]="user.isBanned"
        (mouseenter)="hoverId = user.id"
        (mouseleave)="hoverId = ''"
      >
        <app-avatar [user]="user" [highlighted]="false"></app-avatar>
        <div class="name_and_room">
          <span>{{ user.username }}</span>
        </div>
        <ng-container *ngIf="hoverId === user.id">
          <span
            *ngIf="!user.isBanned"
            (click)="banUser(user.id)"
            class="ban material-icons"
            title="Ban user"
          >
            report
          </span>
          <span *ngIf="user.isBanned"> banned </span>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['users.component.sass'],
})
export class UsersComponent {
  onlineUsers$ = this.store.select(UsersSelectors.onlineUsers)
  offlineUsers$ = this.store.select(UsersSelectors.offlineUsers)
  warnId: string
  warnMessage: string
  hoverId = ''

  constructor(private store: Store) {}

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
