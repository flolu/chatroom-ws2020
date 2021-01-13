import {v4 as uuidv4} from 'uuid'

import {CreateRoom, DeleteRoom, EditRoom, Room, SocketMessage} from '@libs/schema'
import {removeIdProp} from '@libs/common'
import {MessageController} from './socket-controller'
import {database} from './database'
import {OutgoingServerMessageType} from '@libs/enums'

export const createRoom: MessageController = async (socket, payload: CreateRoom) => {
  const collection = await database.roomsCollection()
  const room: Room = {
    id: uuidv4(),
    name: payload.name,
  }
  const result = await collection.insertOne(room)
  const inserted = result.ops[0]
  const message: SocketMessage<Room> = {
    type: OutgoingServerMessageType.CreatedRoom,
    payload: removeIdProp(inserted),
  }
  socket.send(JSON.stringify(message))
}

export const editRoom: MessageController = (socket, payload: EditRoom) => {
  console.log('editRoom', payload)
}

export const deleteRoom: MessageController = (socket, payload: DeleteRoom) => {
  console.log('deleteRoom', payload)
}
