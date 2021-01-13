import {v4 as uuidv4} from 'uuid'

import {CreateRoom, DeleteRoom, EditRoom, Room} from '@libs/schema'
import {removeIdProp} from '@libs/common'
import {OutgoingServerMessageType} from '@libs/enums'
import {MessageController} from './socket-controller'
import {database} from './database'
import {buildSocketMessage} from './socket-message'

export const createRoom: MessageController = async (payload: CreateRoom, socket) => {
  const collection = await database.roomsCollection()
  const room: Room = {
    id: uuidv4(),
    name: payload.name,
  }
  const result = await collection.insertOne(room)
  const inserted = result.ops[0]
  const message = buildSocketMessage<Room>(
    OutgoingServerMessageType.CreatedRoom,
    removeIdProp(inserted)
  )
  socket.send(message)
}

export const editRoom: MessageController = async (payload: EditRoom) => {
  const collection = await database.roomsCollection()
  await collection.findOneAndUpdate({id: payload.id}, {$set: {name: payload.name}})
}

export const deleteRoom: MessageController = async (payload: DeleteRoom) => {
  const collection = await database.roomsCollection()
  await collection.findOneAndDelete({id: payload.id})
}
