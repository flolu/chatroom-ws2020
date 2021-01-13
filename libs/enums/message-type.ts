/**
 * From server-client to server
 */
export enum IncomingServerMessageType {
  CreateRoom = 'rooms.create',
  EditRoom = 'rooms.edit',
  DeleteRoom = 'rooms.delete',
}

/**
 * From server to server-client
 */
export enum OutgoingServerMessageType {
  ListRooms = 'rooms.list',
  CreatedRoom = 'rooms.created',
  EditedRoom = 'rooms.edited',
  DeletedRoom = 'rooms.deleted',

  ListUsers = 'users.list',
  UserCreated = 'users.created',
  UserWentOnline = 'users.wentOnline',
  UserWentOffline = 'users.wentOffline',
}

/**
 * From user-client to server
 */
export enum IncomingClientMessageeType {}

/**
 * From server to user-client
 */
export enum OutgoingClientMessageType {}
