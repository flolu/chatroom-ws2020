import * as WebSocket from 'ws'

import {SocketMessage} from '@libs/schema'
import {IncomingClientMessageeType, IncomingServerMessageType} from '@libs/enums'
import {createRoom, deleteRoom, editRoom} from './room-controllers'
import {authenticateAdmin, authenticateUser, signInUser} from './anonymous-controllers'

export type MessageController = (payload: any, socket: AugmentedSocket) => void

const adminControllers: Record<string, MessageController> = {
  [IncomingServerMessageType.CreateRoom]: createRoom,
  [IncomingServerMessageType.EditRoom]: editRoom,
  [IncomingServerMessageType.DeleteRoom]: deleteRoom,
}

const userControllers: Record<string, MessageController> = {}

const anonymousControllers: Record<string, MessageController> = {
  [IncomingServerMessageType.Authenticate]: authenticateAdmin,
  [IncomingClientMessageeType.SignIn]: signInUser,
  [IncomingClientMessageeType.Authenticate]: authenticateUser,
}

export let onlineUsers = new Map<string, WebSocket>()

export interface AugmentedSocket extends WebSocket {
  userId: string
  isAdmin: boolean
}

export async function socketController(socket: AugmentedSocket) {
  socket.userId = ''
  socket.isAdmin = false

  console.log('anonymous client connected')

  socket.on('message', message => {
    const {type, payload} = JSON.parse(message.toString()) as SocketMessage<any>
    let controller: MessageController | undefined

    if (!socket.isAdmin && !socket.userId) controller = anonymousControllers[type]
    else if (socket.isAdmin) controller = adminControllers[type]
    else if (socket.userId) controller = userControllers[type]

    if (controller) controller(payload, socket)
    else console.log('no controller found for type', type)
  })

  socket.on('close', () => {
    if (socket.userId) onlineUsers.delete(socket.userId)
  })
}
