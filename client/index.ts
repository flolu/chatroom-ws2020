import * as inquirer from 'inquirer'
import * as socketIOClient from 'socket.io-client'

import {ChatClient} from './chat-client'

async function main() {
  console.clear()

  const {username, password} = await inquirer.prompt([
    {type: 'input', name: 'username', message: 'Username:'},
    {type: 'input', name: 'password', message: 'Password:'},
  ])

  const socket = socketIOClient.connect('http://localhost:3000', {query: {username, password}})
  socket.on('connect', () => {
    new ChatClient(socket, username)
  })

  socket.on('disconnect', () => {
    process.exit()
  })
}

main()
