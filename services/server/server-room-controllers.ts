import {v4 as uuidv4} from 'uuid'

import {removeIdProp} from '@libs/common'
import {OutgoingClientMessageType, OutgoingServerMessageType} from '@libs/enums'
import {CreateRoom, DeleteRoom, EditRoom, Room} from '@libs/schema'

import {database} from './database'
import {broadcastMessage, MessageController} from './socket-controller'
import {buildSocketMessage} from './socket-message'

export const createRoom: MessageController = async (payload: CreateRoom, socket) => {
  const collection = await database.roomsCollection()
  const room: Room = {
    id: uuidv4(),
    name: payload.name,
    isPrivate: false,
    privateSettings: undefined,
  }
  const result = await collection.insertOne(room)
  const inserted = removeIdProp(result.ops[0])
  const serverMessage = buildSocketMessage<Room>(OutgoingServerMessageType.CreatedRoom, inserted)
  socket.send(serverMessage)

  const clientMessage = buildSocketMessage<Room>(OutgoingClientMessageType.RoomCreated, inserted)
  broadcastMessage(clientMessage)
}

export const editRoom: MessageController = async (payload: EditRoom) => {
  const collection = await database.roomsCollection()
  const updated = await collection.findOneAndUpdate(
    {id: payload.id},
    {$set: {name: payload.name}},
    {returnOriginal: false}
  )

  const clientMessage = buildSocketMessage<Room>(
    OutgoingClientMessageType.RoomEdited,
    removeIdProp(updated.value!)
  )
  broadcastMessage(clientMessage)
}

export const deleteRoom: MessageController = async (payload: DeleteRoom) => {
  const collection = await database.roomsCollection()
  await collection.findOneAndDelete({id: payload.id})

  const clientMessage = buildSocketMessage<string>(
    OutgoingClientMessageType.RoomDeleted,
    payload.id
  )
  broadcastMessage(clientMessage)
}
