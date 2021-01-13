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

export interface UserCreated {
  user: PublicUser
}

export interface UserWentOnline {
  userId: string
}

export interface UserWentOffline {
  userId: string
}
