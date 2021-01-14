import * as WebSocket from 'ws'

import {SocketMessage, UserWentOffline} from '@libs/schema'
import {
  IncomingClientMessageeType,
  IncomingServerMessageType,
  OutgoingClientMessageType,
  OutgoingServerMessageType,
} from '@libs/enums'
import {createRoom, deleteRoom, editRoom} from './server-room-controllers'
import {authenticateAdmin, authenticateUser, signInUser} from './anonymous-controllers'
import {buildSocketMessage} from './socket-message'
import {banUser, kickUser, warnUser} from './push-user-controllers'
import {joinRoom, sendMessage} from './client-room-controllers'

export type MessageController = (payload: any, socket: AugmentedSocket) => void

const adminControllers: Record<string, MessageController> = {
  [IncomingServerMessageType.CreateRoom]: createRoom,
  [IncomingServerMessageType.EditRoom]: editRoom,
  [IncomingServerMessageType.DeleteRoom]: deleteRoom,

  [IncomingServerMessageType.WarnUser]: warnUser,
  [IncomingServerMessageType.KickUser]: kickUser,
  [IncomingServerMessageType.BanUser]: banUser,
}

const userControllers: Record<string, MessageController> = {
  [IncomingClientMessageeType.JoinRoom]: joinRoom,
  [IncomingClientMessageeType.SendMessage]: sendMessage,
}

const anonymousControllers: Record<string, MessageController> = {
  [IncomingServerMessageType.Authenticate]: authenticateAdmin,
  [IncomingClientMessageeType.SignIn]: signInUser,
  [IncomingClientMessageeType.Authenticate]: authenticateUser,
}

interface ServerState {
  onlineUsers: Map<string, AugmentedSocket>
  adminSocket: AugmentedSocket | undefined
}

export const serverState: ServerState = {
  onlineUsers: new Map<string, AugmentedSocket>(),
  adminSocket: undefined,
}

export interface AugmentedSocket extends WebSocket {
  userId: string
  isAdmin: boolean
  roomId: string
}

export function broadcastMessage(message: string) {
  serverState.onlineUsers.forEach(user => user.send(message))
}

export function broadcastToRoom(message: string, roomId: string) {
  serverState.onlineUsers.forEach(user => {
    if (user.roomId === roomId) {
      user.send(message)
    }
  })
}

export async function socketController(socket: AugmentedSocket) {
  socket.userId = ''
  socket.isAdmin = false
  socket.roomId = ''

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
    if (socket.userId) {
      serverState.onlineUsers.delete(socket.userId)
      if (serverState.adminSocket) {
        const payload: UserWentOffline = {userId: socket.userId}
        const message = buildSocketMessage(OutgoingServerMessageType.UserWentOffline, payload)
        serverState.adminSocket.send(message)
      }
    }

    if (socket.roomId) {
      const leaveMessage = buildSocketMessage(OutgoingClientMessageType.UserLeftRoom, socket.userId)
      broadcastToRoom(leaveMessage, socket.roomId)
    }
  })
}
