import {Component} from '@angular/core'
import {Store} from '@ngrx/store'
import {WebSocketActions} from '@store'

@Component({
  selector: 'app-home',
  template: ` <h2>Server Client Home</h2> `,
  styleUrls: ['home.component.sass'],
})
export class HomeComponent {
  constructor(private store: Store) {
    // TODO remove eventually
    this.store.dispatch(WebSocketActions.send({messageType: 'test', payload: 'hello from client'}))
  }
}
