import * as readline from 'readline'

import {SocketEvent, TextMessage} from '../shared'

export class ChatClient {
  constructor(private readonly socket: SocketIOClient.Socket, private readonly username: string) {
    const input = readline.createInterface({input: process.stdin})
    input.on('line', message => this.sendMessage(message))

    this.socket.on(SocketEvent.TextMessage, data => {
      const message: TextMessage = JSON.parse(data)
      console.log(`>> ${message.username}: ${message.message}`)
    })

    this.socket.on(SocketEvent.OnlineUsers, (usernames: string[]) => {
      console.log('Currently online are', usernames.join(', '))
    })

    this.socket.on(SocketEvent.UserOnline, (username: string) => {
      console.log('-->', username, 'joined the chat')
    })
  }

  private sendMessage(input: string) {
    const payload: TextMessage = {username: this.username, message: input}
    this.socket.emit(SocketEvent.TextMessage, JSON.stringify(payload))
  }
}
