import {Injectable} from '@angular/core'

@Injectable()
export class WebSocketService {
  private ws: WebSocket

  connect() {
    this.ws = new WebSocket('ws://localhost:3000')
    this.ws.onopen = whatever => {
      console.log('connection opned', whatever)
    }
  }
}
