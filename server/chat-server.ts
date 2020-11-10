import * as WebSocket from 'ws'

import {Message, MessageType, UserMessage} from '../shared'

export class ChatServer {
  private userPasswordMap = new Map<string, string>()

  constructor(private readonly wss: WebSocket.Server) {
    this.wss.on('connection', (socket, request) => {
      const username = request.headers.username as string
      const password = request.headers.password as string
      const existingPassword = this.userPasswordMap.get(username)

      if (existingPassword) {
        if (existingPassword !== password) return socket.close(1000, 'Wrong password')
        console.log(`${username} successfully authenticated`)
      } else {
        this.userPasswordMap.set(username, password)
        console.log(`created user with name ${username}`)
      }

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
