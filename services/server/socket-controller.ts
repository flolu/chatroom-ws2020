import * as WebSocket from 'ws'

import {ListRooms, SocketMessage} from '@libs/schema'
import {removeIdProp} from '@libs/common'
import {IncomingServerMessageType, OutgoingServerMessageType} from '@libs/enums'
import {AugmentedRequest} from './models'
import {createRoom, deleteRoom, editRoom} from './room-controllers'
import {buildSocketMessage} from './socket-message'
import {database} from './database'

export type MessageController = (payload: any, ws: WebSocket) => void

const controllers: Record<string, MessageController> = {
  [IncomingServerMessageType.CreateRoom]: createRoom,
  [IncomingServerMessageType.EditRoom]: editRoom,
  [IncomingServerMessageType.DeleteRoom]: deleteRoom,
}

export async function socketController(socket: WebSocket, req: AugmentedRequest) {
  const {username, isAdmin} = req as AugmentedRequest
  console.log('client connected', {username, isAdmin})

  socket.on('message', message => {
    const {type, payload} = JSON.parse(message.toString()) as SocketMessage<any>
    const controller = controllers[type]
    if (controller) return controller(payload, socket)
    console.log('Unkown incoming message type', type)
  })

  const collection = await database.roomsCollection()
  const result = await collection.find({})
  const rooms = (await result.toArray()).map(removeIdProp)
  const listRooms = buildSocketMessage<ListRooms>(OutgoingServerMessageType.ListRooms, {rooms})
  socket.send(listRooms)
}
