import * as WebSocket from 'ws'

import {Message, MessageType, UserMessage} from '../shared'

export class ChatServer {
  constructor(private readonly wss: WebSocket.Server) {
    this.wss.on('connection', socket => {
      socket.on('message', msg => {
        const data: Message<any> = JSON.parse(msg.toString())

        if (data.type === MessageType.UserMessage) this.handleUserMessage(socket, data.payload)
      })
    })
  }

  handleUserMessage(socket: WebSocket, message: UserMessage) {
    this.wss.clients.forEach(client => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        const data: Message<UserMessage> = {type: MessageType.UserMessage, payload: message}
        client.send(JSON.stringify(data))
      }
    })
  }
}
