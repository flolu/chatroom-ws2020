import * as WebSocket from 'ws'
import * as inquirer from 'inquirer'
import * as readline from 'readline'

import {EventName, TextMessage} from '../shared'

async function main() {
  console.clear()

  const {username, password} = await inquirer.prompt([
    {type: 'input', name: 'username', message: 'Username:'},
    {type: 'input', name: 'password', message: 'Password:'},
  ])

  const socket = new WebSocket('ws://localhost:8080', {headers: {username, password}})

  socket.on('open', () => {
    const input = readline.createInterface({input: process.stdin})
    input.on('line', message => {
      const payload: TextMessage = {username, message}
      socket.send(JSON.stringify({type: EventName.TextMessage, data: payload}))
    })
  })

  socket.on('message', message => {
    const {type, data} = JSON.parse(message.toString())
    switch (type) {
      case EventName.TextMessage: {
        console.log(`>> ${data.username}: ${data.message}`)
        break
      }
      case EventName.OnlineUsers: {
        if (data.length === 0) return console.log('No one is online')
        if (data.length === 1) return console.log(`Only ${data[0]} is online`)
        console.log('Currently online are:', data.join(', '))
        break
      }
      case EventName.UserJoined: {
        console.log('-->', data, 'joined the chat')
        break
      }
      case EventName.UserLeft: {
        console.log('<--', data, 'left the chat')
        break
      }
    }
  })

  socket.on('close', () => process.exit())
}

main()
