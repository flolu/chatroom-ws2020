import * as WebSocket from 'ws'
import * as inquirer from 'inquirer'
import * as readline from 'readline'

export class ChatClient {
  private isAuthenticated = false

  constructor(private readonly socket: WebSocket) {}

  async init() {
    console.clear()

    const {username, password} = await inquirer.prompt([
      {type: 'input', name: 'username', message: 'Username:'},
      {type: 'input', name: 'password', message: 'Password:'},
    ])
    this.isAuthenticated = true

    const input = readline.createInterface({input: process.stdin})
    input.on('line', message => this.socket.send(message))
  }

  message(event: WebSocket.MessageEvent) {
    if (!this.isAuthenticated) return
    console.log('>> ' + event.data)
  }
}
