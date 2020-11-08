import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'

import {ChatServer} from './chat-server'

const server = http.createServer(express)
const wss = new WebSocket.Server({server})
new ChatServer(wss)

server.listen(3000, () => console.log('Server started'))
