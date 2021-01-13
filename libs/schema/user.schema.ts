export interface PublicUser {
  id: string
  username: string
}

export interface User extends PublicUser {
  passwordHash: string
}

export interface ListUsers {
  users: PublicUser[]
  onlineUserIds: string[]
}
