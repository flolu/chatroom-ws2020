import * as WebSocket from 'ws'

import {EventName} from '../shared'

const server = new WebSocket.Server({port: 8080})
const passwords = new Map<string, string>()
const clients = new Map<string, WebSocket>()

server.on('connection', (socket, request) => {
  const username = request.headers.username.toString()
  const password = request.headers.password.toString()
  const existingPassword = passwords.get(username)

  if (existingPassword) {
    if (existingPassword !== password) return socket.close()
    console.log(`${username} successfully authenticated`)
  } else {
    passwords.set(username, password)
    clients.set(username, socket)
    console.log(`created user with name ${username}`)
  }

  const usernames = []
  clients.forEach((client, username) => {
    if (client.readyState === WebSocket.OPEN) usernames.push(username)
  })
  const message1 = {type: EventName.OnlineUsers, data: usernames}
  socket.emit(JSON.stringify(message1))

  const message2 = {type: EventName.UserOnline, data: username}
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(message2))
  })

  socket.on('message', message => {
    console.log('incoming message', message)
    const {type, data} = JSON.parse(message.toString())
    if (type === EventName.TextMessage) {
      const message3 = {type: EventName.TextMessage, data}
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(message3))
      })
    }
  })
})

// TODO broadcast helper, don't send to self
// TODO message creator helper
