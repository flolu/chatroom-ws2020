import {Message} from './message.schema'
import {PublicUser} from './user.schema'

export interface Room {
  id: string
  name: string
  isPrivate: boolean
  privateSettings?: {
    privateUser1Id: string
    privateUser2Id: string
    isClosed: boolean
  }
}

export interface CreateRoom {
  name: string
}

export interface EditRoom {
  id: string
  name: string
}

export interface DeleteRoom {
  id: string
}

export interface ListRooms {
  rooms: Room[]
  messages: Message[]
  users: PublicUser[]
}

export interface JoinRoom {
  id: string
}

export interface JoinedRoom {
  id: string
  messages: Message[]
  users: PublicUser[]
  onlineUserIds: string[]
}

export interface CreatePrivateRoom {
  username: string
}

export interface ClosePrivateRoom {
  id: string
}

export interface PrivateRoomCreated {
  room: Room
  partner: PublicUser
}

export interface PrivateRoomClosed {
  id: string
}
