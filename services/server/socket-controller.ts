import * as fs from 'fs'
import * as path from 'path'
import * as WebSocket from 'ws'

import {
    IncomingClientMessageeType, IncomingServerMessageType, OutgoingClientMessageType,
    OutgoingServerMessageType
} from '@libs/enums'
import {NetworkLog, SocketMessage, UserWentOffline} from '@libs/schema'

import {authenticateAdmin, authenticateUser, signInUser} from './anonymous-controllers'
import {closePrivateRoom, createPrivateRoom, joinRoom, sendMessage} from './client-room-controllers'
import {banUser, kickUser, warnUser} from './push-user-controllers'
import {createRoom, deleteRoom, editRoom} from './server-room-controllers'
import {buildSocketMessage} from './socket-message'

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
  [IncomingClientMessageeType.CreatePrivateRoom]: createPrivateRoom,
  [IncomingClientMessageeType.ClosePrivateRoom]: closePrivateRoom,
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

  await logMessage({type: 'client.connected', payload: {}}, '')

  socket.on('message', async message => {
    const {type, payload} = JSON.parse(message.toString()) as SocketMessage<any>

    let controller: MessageController | undefined

    if (!socket.isAdmin && !socket.userId) controller = anonymousControllers[type]
    else if (socket.isAdmin) controller = adminControllers[type]
    else if (socket.userId) controller = userControllers[type]

    if (controller) controller(payload, socket)
    else console.log('no controller found for type', type)

    await logMessage({type, payload}, socket.userId)
  })

  socket.on('close', async () => {
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

    await logMessage(
      {
        type: 'client.disconnected',
        payload: {
          userId: socket.userId,
          isAdmind: socket.isAdmin,
        },
      },
      socket.userId
    )
  })
}

const logFileName = 'logs.txt'
const logFilePath = path.join(__dirname, logFileName)

async function logMessage(data: {type: string; payload: any}, userId: string) {
  const payload: NetworkLog = {timestamp: new Date().toISOString(), data, userId}
  const logMessage = buildSocketMessage(OutgoingServerMessageType.Log, payload)

  try {
    await fs.promises.readFile(logFilePath)
  } catch (e) {
    /**
     * Create logs file if it doesn't exist
     */
    await fs.promises.writeFile(logFilePath, '')
  }
  await fs.promises.appendFile(logFilePath, logMessage + '\n')

  if (serverState.adminSocket) {
    serverState.adminSocket.send(logMessage)
  }
}
