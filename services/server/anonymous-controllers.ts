import * as bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'

import {removeIdProp} from '@libs/common'
import {OutgoingClientMessageType, OutgoingServerMessageType} from '@libs/enums'
import {
    AuthenticateAdmin, AuthenticatedAdmin, AuthenticateFail, AuthenticateRequest,
    AuthenticateSuccess, ListRooms, ListUsers, SignInFail, SignInRequest, SignInSuccess, User,
    UserCreated, UserWentOnline
} from '@libs/schema'

import {AuthToken} from './auth-token'
import {config} from './config'
import {database} from './database'
import {AugmentedSocket, MessageController, serverState} from './socket-controller'
import {buildSocketMessage} from './socket-message'

export const authenticateAdmin: MessageController = async (payload: AuthenticateAdmin, socket) => {
  if (payload.secret === config.adminSecret) {
    socket.isAdmin = true
    serverState.adminSocket = socket

    const authenticatedMessage = buildSocketMessage<AuthenticatedAdmin>(
      OutgoingServerMessageType.Authenticated,
      {}
    )
    socket.send(authenticatedMessage)

    const users = await getUsers()
    const payload: ListUsers = {users, onlineUserIds: Array.from(serverState.onlineUsers.keys())}
    const usersMessage = buildSocketMessage<ListUsers>(OutgoingServerMessageType.ListUsers, payload)
    socket.send(usersMessage)

    const rooms = await getRooms()
    const messageCollection = await database.messagesCollection()
    const messagesResult = await messageCollection.find({roomId: {$in: rooms.map(r => r.id)}})
    const messages = await (await messagesResult.toArray()).map(removeIdProp)
    const roomsMessage = buildSocketMessage<ListRooms>(OutgoingServerMessageType.ListRooms, {
      rooms,
      messages,
      users: [],
    })
    socket.send(roomsMessage)
  }
}

async function getRooms() {
  const collection = await database.roomsCollection()
  const result = await collection.find({
    $or: [{isPrivate: false}, {isPrivate: true, 'privateSettings.isClosed': false}],
  })
  return (await result.toArray()).map(removeIdProp)
}

async function getUsers() {
  const collection = await database.usersCollection()
  const result = await collection.find()
  return (await result.toArray())
    .map(removeIdProp)
    .map(({passwordHash, ...publicUser}) => publicUser)
}

export const signInUser: MessageController = async (payload: SignInRequest, socket) => {
  const {username, password} = payload
  const collection = await database.usersCollection()
  const user = await collection.findOne({username})

  if (user) {
    if (user.isBanned) {
      return socket.send(
        buildSocketMessage<SignInFail>(OutgoingClientMessageType.SignInFail, {
          error: 'You have been banned from the server',
        })
      )
    }

    const {passwordHash, ...publicUser} = user
    const match = await bcrypt.compare(password, user.passwordHash)
    if (match) {
      userWentOnline(user.id, socket)
      socket.userId = user.id
      socket.send(
        buildSocketMessage<SignInSuccess>(OutgoingClientMessageType.SignInDone, {
          user: removeIdProp(publicUser),
          token: new AuthToken(user.id).sign(config.tokenSecret),
        })
      )
      await initializeUser(socket)
    } else {
      socket.send(
        buildSocketMessage<SignInFail>(OutgoingClientMessageType.SignInFail, {
          error: 'Invalid password',
        })
      )
    }
  } else {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const createdUser: User = {id: uuidv4(), username, passwordHash: hash, isBanned: false}
    await collection.insertOne(createdUser)
    const {passwordHash, ...publicUser} = createdUser

    socket.userId = createdUser.id
    serverState.onlineUsers.set(createdUser.id, socket)
    if (serverState.adminSocket) {
      const payload: UserCreated = {user: removeIdProp(publicUser)}
      const message = buildSocketMessage(OutgoingServerMessageType.UserCreated, payload)
      serverState.adminSocket.send(message)
    }

    socket.send(
      buildSocketMessage<SignInSuccess>(OutgoingClientMessageType.SignInDone, {
        user: removeIdProp(publicUser),
        token: new AuthToken(createdUser.id).sign(config.tokenSecret),
      })
    )
    await initializeUser(socket)
  }
}

export const authenticateUser: MessageController = async (payload: AuthenticateRequest, socket) => {
  try {
    const current = AuthToken.fromString(payload.token, config.tokenSecret)
    const collection = await database.usersCollection()
    const user = await collection.findOne({id: current.userId})
    if (!user) throw 'User not found'

    if (user.isBanned) {
      return socket.send(
        buildSocketMessage<SignInFail>(OutgoingClientMessageType.SignInFail, {
          error: 'You have been banned from the server',
        })
      )
    }

    const {passwordHash, ...publicUser} = user

    socket.userId = user.id
    userWentOnline(user.id, socket)
    socket.send(
      buildSocketMessage<AuthenticateSuccess>(OutgoingClientMessageType.AuthenticateDone, {
        user: removeIdProp(publicUser),
        token: new AuthToken(current.userId).sign(config.tokenSecret),
      })
    )
    await initializeUser(socket)
  } catch (error) {
    socket.send(
      buildSocketMessage<AuthenticateFail>(OutgoingClientMessageType.AuthenticateFail, {
        error: error || 'Invalid token',
      })
    )
  }
}

function userWentOnline(userId: string, socket: AugmentedSocket) {
  serverState.onlineUsers.set(userId, socket)
  if (serverState.adminSocket) {
    const payload: UserWentOnline = {userId}
    const message = buildSocketMessage(OutgoingServerMessageType.UserWentOnline, payload)
    serverState.adminSocket.send(message)
  }
}

async function initializeUser(socket: AugmentedSocket) {
  const roomsCollection = await database.roomsCollection()
  const publicRoomsResult = await roomsCollection.find({isPrivate: false})
  const privateRoomsResult = await roomsCollection.find({
    isPrivate: true,
    'privateSettings.isClosed': false,
    $or: [
      {'privateSettings.privateUser1Id': socket.userId},
      {'privateSettings.privateUser2Id': socket.userId},
    ],
  })
  const publicRooms = (await publicRoomsResult.toArray()).map(removeIdProp)
  const privateRooms = (await privateRoomsResult.toArray()).map(removeIdProp)
  const rooms = [...publicRooms, ...privateRooms]
  const messageCollection = await database.messagesCollection()
  const messagesResult = await messageCollection.find({roomId: {$in: rooms.map(r => r.id)}})
  const messages = await (await messagesResult.toArray()).map(removeIdProp)
  const users = await getUsers()
  const payload: ListRooms = {rooms, messages, users}
  const roomsMessage = buildSocketMessage(OutgoingClientMessageType.ListRooms, payload)
  socket.send(roomsMessage)
}
