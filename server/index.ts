import * as http from 'http'
import * as socketIO from 'socket.io'

import {ChatServer} from './chat-server'

const server = http.createServer()
const io = new socketIO.Server(server)
new ChatServer(io)

server.listen(3000, () => console.log('Server started'))
