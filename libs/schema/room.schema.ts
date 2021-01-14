import {Message} from './message.schema'
import {PublicUser} from './user.schema'

export interface Room {
  id: string
  name: string
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
