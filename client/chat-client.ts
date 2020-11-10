import * as WebSocket from 'ws'
import * as readline from 'readline'

import {Message, MessageType, UserMessage} from '../shared'

export class ChatClient {
  constructor(private readonly socket: WebSocket, private readonly username: string) {
    const input = readline.createInterface({input: process.stdin})
    input.on('line', message => this.sendMessage(message))
  }

  onMessage(message: UserMessage) {
    console.log(`>> ${message.username}: ${message.message}`)
  }

  private sendMessage(input: string) {
    const payload: Message<UserMessage> = {
      type: MessageType.UserMessage,
      payload: {username: this.username!, message: input},
    }
    this.socket.send(JSON.stringify(payload))
  }
}
