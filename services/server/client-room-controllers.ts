import {v4 as uuidv4} from 'uuid'

import {removeIdProp} from '@libs/common'
import {OutgoingClientMessageType, OutgoingServerMessageType} from '@libs/enums'
import {
    ClosePrivateRoom, CreatePrivateRoom, JoinedRoom, JoinRoom, Message, PrivateRoomClosed,
    PrivateRoomCreated, Room, UserJoinedRoom, UserLeftRoom
} from '@libs/schema'

import {database} from './database'
import {broadcastToRoom, MessageController, serverState} from './socket-controller'
import {buildSocketMessage} from './socket-message'

export const joinRoom: MessageController = async (payload: JoinRoom, socket) => {
  const userCollection = await database.usersCollection()
  const user = await userCollection.findOne({id: socket.userId})
  if (!user) return

  if (socket.roomId === payload.id) return

  const roomCollection = await database.roomsCollection()
  const room = await roomCollection.findOne({id: payload.id})
  if (!room) return
  if (room.isPrivate && room.privateSettings?.isClosed) return
  if (
    room.isPrivate &&
    room.privateSettings?.privateUser1Id !== socket.userId &&
    room.privateSettings?.privateUser2Id !== socket.userId
  )
    return

  if (socket.roomId) {
    const leaveMessage = buildSocketMessage(OutgoingClientMessageType.UserLeftRoom, socket.userId)
    broadcastToRoom(leaveMessage, socket.roomId)

    if (serverState.adminSocket) {
      const payload: UserLeftRoom = {userId: socket.userId, roomId: socket.roomId}
      const serverLeaveMessage = buildSocketMessage(OutgoingServerMessageType.UserLeftRoom, payload)
      serverState.adminSocket.send(serverLeaveMessage)
    }
  }

  const messageCollection = await database.messagesCollection()
  const messagesResult = await messageCollection.find({roomId: payload.id}, {sort: {timestamp: 1}})
  const messages = (await messagesResult.toArray()).map(removeIdProp)

  const userIds = room.isPrivate
    ? [room.privateSettings!.privateUser1Id, room.privateSettings!.privateUser2Id]
    : messages.map(m => m.fromId).filter((el, index, self) => index === self.indexOf(el))
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

  if (serverState.adminSocket) {
    const payload: UserJoinedRoom = {userId: socket.userId, roomId: socket.roomId}
    const serverJoinMessage = buildSocketMessage(OutgoingServerMessageType.UserJoinedRoom, payload)
    serverState.adminSocket.send(serverJoinMessage)
  }

  const {passwordHash, ...publicUser} = user
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

export const createPrivateRoom: MessageController = async (payload: CreatePrivateRoom, socket) => {
  if (!socket.userId) return
  const userCollection = await database.usersCollection()

  const creator = await userCollection.findOne({id: socket.userId})
  const partner = await userCollection.findOne({username: payload.username})
  if (!creator || !partner) return

  /**
   * Don't create a new private room if there is still
   * an open private room between the two users
   */
  const roomCollection = await database.roomsCollection()
  const existing = await roomCollection.findOne({
    isPrivate: true,
    'privateSettings.isClosed': false,
    $or: [
      {'privateSettings.privateUser1Id': creator.id, 'privateSettings.privateUser2Id': partner.id},
      {'privateSettings.privateUser1Id': partner.id, 'privateSettings.privateUser2Id': creator.id},
    ],
  })
  if (existing) return

  /**
   * Persist room to the database
   */
  const room: Room = {
    id: uuidv4(),
    name: ``,
    isPrivate: true,
    privateSettings: {
      isClosed: false,
      privateUser1Id: creator.id,
      privateUser2Id: partner.id,
    },
  }
  const result = await roomCollection.insertOne(room)

  /**
   * Notify both clients about the creation of
   * the private room
   */
  const createdCreatorMessage = buildSocketMessage<PrivateRoomCreated>(
    OutgoingClientMessageType.PrivateRoomCreated,
    {room, partner}
  )
  socket.send(createdCreatorMessage)
  const createdParnerMessage = buildSocketMessage<PrivateRoomCreated>(
    OutgoingClientMessageType.PrivateRoomCreated,
    {room, partner: creator}
  )
  const partnerSocket = serverState.onlineUsers.get(partner.id)
  if (partnerSocket) partnerSocket.send(createdParnerMessage)
}

export const closePrivateRoom: MessageController = async (payload: ClosePrivateRoom, socket) => {
  if (!socket.userId) return

  const roomCollection = await database.roomsCollection()
  const room = await roomCollection.findOne({id: payload.id})
  if (!room) return
  if (!room.isPrivate) return
  if (room.privateSettings?.isClosed) return
  if (
    socket.userId !== room.privateSettings?.privateUser1Id &&
    socket.userId !== room.privateSettings?.privateUser2Id
  )
    return

  await roomCollection.findOneAndUpdate({id: room.id}, {$set: {'privateSettings.isClosed': true}})

  /**
   * Notify both clients that the private room has
   * been closed
   */
  const userCollection = await database.usersCollection()
  const user1 = await userCollection.findOne({id: room.privateSettings.privateUser1Id})
  const user2 = await userCollection.findOne({id: room.privateSettings.privateUser2Id})

  const closedMessage = buildSocketMessage<PrivateRoomClosed>(
    OutgoingClientMessageType.PrivateRoomClosed,
    {id: room.id}
  )
  const user1Socket = serverState.onlineUsers.get(user1!.id)
  if (user1Socket) user1Socket.send(closedMessage)
  const user2Socket = serverState.onlineUsers.get(user2!.id)
  if (user2Socket) user2Socket.send(closedMessage)
}
