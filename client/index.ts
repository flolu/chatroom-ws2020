import * as WebSocket from 'ws'
import * as inquirer from 'inquirer'

import {Message, MessageType} from '../shared'
import {ChatClient} from './chat-client'

async function main() {
  console.clear()

  const {username, password} = await inquirer.prompt([
    {type: 'input', name: 'username', message: 'Username:'},
    {type: 'input', name: 'password', message: 'Password:'},
  ])

  const socket = new WebSocket('ws://localhost:3000', {headers: {username, password}})
  let chat: ChatClient

  socket.onopen = () => {
    chat = new ChatClient(socket, username)
  }

  socket.onmessage = event => {
    const data: Message<any> = JSON.parse(event.data.toString())
    if (data.type === MessageType.UserMessage) chat.onMessage(data.payload)
  }

  socket.onerror = err => {
    console.log(err.message)
    process.exit()
  }

  socket.onclose = event => {
    console.log(event.reason)
    process.exit()
  }
}

main()
