import * as WebSocket from 'ws'

import {ListRooms, ListUsers, SocketMessage} from '@libs/schema'
import {removeIdProp} from '@libs/common'
import {IncomingServerMessageType, OutgoingServerMessageType} from '@libs/enums'
import {AugmentedRequest} from './models'
import {createRoom, deleteRoom, editRoom} from './room-controllers'
import {buildSocketMessage} from './socket-message'
import {database} from './database'

export type MessageController = (payload: any, ws: WebSocket, req: AugmentedRequest) => void

const adminControllers: Record<string, MessageController> = {
  [IncomingServerMessageType.CreateRoom]: createRoom,
  [IncomingServerMessageType.EditRoom]: editRoom,
  [IncomingServerMessageType.DeleteRoom]: deleteRoom,
}

const userControllers: Record<string, MessageController> = {}

let onlineUsers = new Map<string, WebSocket>()

export async function socketController(socket: WebSocket, req: AugmentedRequest) {
  const {userId, isAdmin} = req as AugmentedRequest

  if (isAdmin) {
    console.log('admin connected')

    socket.on('message', message => {
      const {type, payload} = JSON.parse(message.toString()) as SocketMessage<any>
      const controller = adminControllers[type]
      if (controller) controller(payload, socket, req)
    })

    await Promise.all([listRooms(socket), listUsers(socket)])
  } else {
    console.log('user connected', userId)

    onlineUsers.set(userId, socket)
    console.log({onlineUsers})
    socket.on('message', message => {
      const {type, payload} = JSON.parse(message.toString()) as SocketMessage<any>
      const controller = userControllers[type]
      if (controller) controller(payload, socket, req)
    })

    socket.on('close', () => {
      onlineUsers.delete(userId)
    })
  }
}

async function listRooms(socket: WebSocket) {
  const collection = await database.roomsCollection()
  const result = await collection.find({})
  const rooms = (await result.toArray()).map(removeIdProp)
  const message = buildSocketMessage<ListRooms>(OutgoingServerMessageType.ListRooms, {rooms})
  socket.send(message)
}

async function listUsers(socket: WebSocket) {
  const collection = await database.usersCollection()
  const result = await collection.find({})
  const users = (await result.toArray())
    .map(removeIdProp)
    .map(({passwordHash, ...publicUser}) => publicUser)

  const payload: ListUsers = {users, onlineUserIds: Array.from(onlineUsers.keys())}
  const message = buildSocketMessage<ListUsers>(OutgoingServerMessageType.ListUsers, payload)
  socket.send(message)
}
