import {Injectable} from '@angular/core'

@Injectable()
export class WebSocketService {
  public url = 'ws://localhost:3000'
  public websocket: WebSocket
}
