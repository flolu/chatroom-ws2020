import * as WebSocket from 'ws'

import {EventName} from '../shared'

const server = new WebSocket.Server({port: 8080})
const passwords = new Map<string, string>()
const connectedClients = new Map<string, WebSocket>()

server.on('connection', (socket, request) => {
  const username = request.headers.username.toString()
  const password = request.headers.password.toString()
  const existingPassword = passwords.get(username)
  const usernames = Array.from(connectedClients.keys())

  if (existingPassword) {
    if (existingPassword !== password) return socket.close()
    console.log(`${username} successfully authenticated`)
  } else {
    passwords.set(username, password)
    connectedClients.set(username, socket)
    console.log(`created user with name ${username}`)
  }

  socket.send(createMessage(EventName.OnlineUsers, usernames))
  broadcast(username, createMessage(EventName.UserJoined, username))

  socket.on('message', message => {
    console.log('incoming message', message)
    const {type, data} = JSON.parse(message.toString())
    if (type === EventName.TextMessage) {
      broadcast(username, createMessage(EventName.TextMessage, data))
    }
  })

  socket.on('close', () => {
    broadcast(username, createMessage(EventName.UserLeft, username))
    connectedClients.delete(username)
  })
})

function broadcast(fromUsername: string, message: string) {
  connectedClients.forEach((client, username) => {
    if (client.readyState === WebSocket.OPEN && username !== fromUsername) client.send(message)
  })
}

function createMessage(name: EventName, data: any) {
  return JSON.stringify({type: name, data})
}
