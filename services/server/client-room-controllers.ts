import {v4 as uuidv4} from 'uuid'

import {removeIdProp} from '@libs/common'
import {OutgoingClientMessageType} from '@libs/enums'
import {JoinedRoom, JoinRoom, Message} from '@libs/schema'
import {database} from './database'
import {broadcastToRoom, MessageController, serverState} from './socket-controller'
import {buildSocketMessage} from './socket-message'

export const joinRoom: MessageController = async (payload: JoinRoom, socket) => {
  const userCollection = await database.usersCollection()
  const user = await userCollection.findOne({id: socket.userId})
  if (!user) return

  const {passwordHash, ...publicUser} = user

  if (socket.roomId) {
    const leaveMessage = buildSocketMessage(OutgoingClientMessageType.UserLeftRoom, socket.userId)
    broadcastToRoom(leaveMessage, socket.roomId)
  }

  const messageCollection = await database.messagesCollection()
  const messagesResult = await messageCollection.find({roomId: payload.id}, {sort: {timestamp: 1}})
  const messages = (await messagesResult.toArray()).map(removeIdProp)

  const userIds = messages
    .map(m => m.fromId)
    .filter((el, index, self) => index === self.indexOf(el))
  const usersResult = await userCollection.find({id: {$in: userIds}})
  const users = (await usersResult.toArray()).map(removeIdProp)

  let onlineUserIds: string[] = []
  serverState.onlineUsers.forEach(user => {
    if (user.roomId === payload.id) onlineUserIds.push(user.userId)
  })

  socket.roomId = payload.id

  const joinInfoPayload: JoinedRoom = {id: payload.id, messages, users, onlineUserIds}
  const joinInfoMessage = buildSocketMessage(
    OutgoingClientMessageType.RoomJoinInfo,
    joinInfoPayload
  )
  socket.send(joinInfoMessage)

  const joinMessage = buildSocketMessage(
    OutgoingClientMessageType.UserJoinedRoom,
    removeIdProp(publicUser)
  )
  broadcastToRoom(joinMessage, payload.id)
}

export const sendMessage: MessageController = async (payload: string, socket) => {
  if (!socket.roomId) return

  const messageCollection = await database.messagesCollection()
  const message: Message = {
    id: uuidv4(),
    message: payload,
    fromId: socket.userId,
    roomId: socket.roomId,
    timestamp: new Date().toISOString(),
  }
  const result = await messageCollection.insertOne(message)
  const inserted = removeIdProp(result.ops[0])

  const chatMessage = buildSocketMessage(OutgoingClientMessageType.IncomingMessage, inserted)
  broadcastToRoom(chatMessage, socket.roomId)
}
