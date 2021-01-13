import * as WebSocket from 'ws'

import {AugmentedSocket, socketController} from './socket-controller'

const server = new WebSocket.Server({port: 3000})
server.on('connection', socket => socketController(socket as AugmentedSocket))
