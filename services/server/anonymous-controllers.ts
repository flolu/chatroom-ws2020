import * as bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'

import {removeIdProp} from '@libs/common'
import {OutgoingClientMessageType, OutgoingServerMessageType} from '@libs/enums'
import {
  AuthenticateAdmin,
  AuthenticatedAdmin,
  AuthenticateFail,
  AuthenticateRequest,
  AuthenticateSuccess,
  ListRooms,
  ListUsers,
  SignInFail,
  SignInRequest,
  SignInSuccess,
  User,
  UserCreated,
  UserWentOnline,
} from '@libs/schema'
import {config} from './config'
import {database} from './database'
import {AugmentedSocket, MessageController, serverState} from './socket-controller'
import {buildSocketMessage} from './socket-message'
import {AuthToken} from './auth-token'

export const authenticateAdmin: MessageController = async (payload: AuthenticateAdmin, socket) => {
  if (payload.secret === config.adminSecret) {
    socket.isAdmin = true
    serverState.adminSocket = socket

    const authenticatedMessage = buildSocketMessage<AuthenticatedAdmin>(
      OutgoingServerMessageType.Authenticated,
      {}
    )
    socket.send(authenticatedMessage)

    const rooms = await getRooms()
    const roomsMessage = buildSocketMessage<ListRooms>(OutgoingServerMessageType.ListRooms, {rooms})
    socket.send(roomsMessage)

    const users = await getUsers()
    const payload: ListUsers = {users, onlineUserIds: Array.from(serverState.onlineUsers.keys())}
    const usersMessage = buildSocketMessage<ListUsers>(OutgoingServerMessageType.ListUsers, payload)
    socket.send(usersMessage)
  }
}

async function getRooms() {
  const collection = await database.roomsCollection()
  const result = await collection.find({})
  return (await result.toArray()).map(removeIdProp)
}

async function getUsers() {
  const collection = await database.usersCollection()
  const result = await collection.find({})
  return (await result.toArray())
    .map(removeIdProp)
    .map(({passwordHash, ...publicUser}) => publicUser)
}

export const signInUser: MessageController = async (payload: SignInRequest, socket) => {
  const {username, password} = payload
  const collection = await database.usersCollection()
  const user = await collection.findOne({username})

  if (user) {
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
    const createdUser: User = {id: uuidv4(), username, passwordHash: hash}
    await collection.insertOne(createdUser)
    const {passwordHash, ...publicUser} = createdUser

    socket.userId = createdUser.id
    serverState.onlineUsers.set(createdUser.id, socket)
    if (serverState.adminSocket) {
      const payload: UserCreated = {user: publicUser}
      const message = buildSocketMessage(OutgoingServerMessageType.UserCreated, payload)
      serverState.adminSocket.send(message)
    }

    socket.send(
      buildSocketMessage<SignInSuccess>(OutgoingClientMessageType.SignInDone, {
        user: removeIdProp(publicUser),
        token: new AuthToken(createdUser.id).sign(config.tokenSecret),
      })
    )
  }
}

export const authenticateUser: MessageController = async (payload: AuthenticateRequest, socket) => {
  try {
    const current = AuthToken.fromString(payload.token, config.tokenSecret)
    const collection = await database.usersCollection()
    const user = await collection.findOne({id: current.userId})
    if (!user) throw 'User not found'
    const {passwordHash, ...publicUser} = user

    socket.userId = user.id
    userWentOnline(user.id, socket)
    socket.send(
      buildSocketMessage<AuthenticateSuccess>(OutgoingClientMessageType.AuthenticateDone, {
        user: publicUser,
        token: new AuthToken(current.userId).sign(config.tokenSecret),
      })
    )
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