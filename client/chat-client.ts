import * as WebSocket from 'ws'
import * as inquirer from 'inquirer'
import * as readline from 'readline'

import {Message, MessageType, UserMessage} from '../shared'

export class ChatClient {
  private isAuthenticated = false
  private username?: string

  constructor(private readonly socket: WebSocket) {}

  async init() {
    console.clear()

    const {username, password} = await inquirer.prompt([
      {type: 'input', name: 'username', message: 'Username:'},
      {type: 'input', name: 'password', message: 'Password:'},
    ])
    this.isAuthenticated = true
    this.username = username

    const input = readline.createInterface({input: process.stdin})
    input.on('line', message => this.sendMessage(message))
  }

  onMessage(message: UserMessage) {
    if (!this.isAuthenticated) return
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
