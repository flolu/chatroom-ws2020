import {Server, Socket} from 'socket.io'

import {TextMessage, SocketEvent} from '../shared'

export class ChatServer {
  private userPasswordMap = new Map<string, string>()

  constructor(private readonly io: Server) {
    this.io.on('connection', (socket: Socket) => {
      const query = socket.handshake.query as any
      const username = query.username
      const password = query.password
      const existingPassword = this.userPasswordMap.get(username)

      if (existingPassword) {
        if (existingPassword !== password) return socket.disconnect()
        console.log(`${username} successfully authenticated`)
      } else {
        this.userPasswordMap.set(username, password)
        console.log(`created user with name ${username}`)
      }

      const sockets = Array.from(io.sockets.sockets.values())
      const usernames = sockets.map(s => (s.handshake.query as any).username)
      socket.emit(SocketEvent.OnlineUsers, usernames)

      socket.broadcast.emit(SocketEvent.UserOnline, username)

      socket.on(SocketEvent.TextMessage, data => {
        const message: TextMessage = JSON.parse(data)
        socket.broadcast.emit(SocketEvent.TextMessage, JSON.stringify(message))
      })
    })
  }
}
