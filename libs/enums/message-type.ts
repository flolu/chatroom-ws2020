/**
 * From server-client to server
 */
export enum IncomingServerMessageType {
  Authenticate = 'admin.authenticate',

  CreateRoom = 'rooms.create',
  EditRoom = 'rooms.edit',
  DeleteRoom = 'rooms.delete',

  WarnUser = 'users.warn',
  KickUser = 'users.kick',
  BanUser = 'users.ban',
}

/**
 * From server to server-client
 */
export enum OutgoingServerMessageType {
  Authenticated = 'admin.authenticated',

  ListRooms = 'rooms.list',
  CreatedRoom = 'rooms.created',
  EditedRoom = 'rooms.edited',
  DeletedRoom = 'rooms.deleted',

  ListUsers = 'users.list',
  UserCreated = 'users.created',
  UserWentOnline = 'users.wentOnline',
  UserWentOffline = 'users.wentOffline',
  UserJoinedRoom = 'users.joinedRoom',
  UserLeftRoom = 'users.leftRoom',
}

/**
 * From user-client to server
 */
export enum IncomingClientMessageeType {
  Authenticate = 'client.authenticate',
  SignIn = 'client.signIn',

  JoinRoom = 'rooms.join',
  SendMessage = 'rooms.message',
}

/**
 * From server to user-client
 */
export enum OutgoingClientMessageType {
  AuthenticateDone = 'client.authenticate.done',
  AuthenticateFail = 'client.authenticate.fail',
  SignInDone = 'client.signIn.done',
  SignInFail = 'client.signIn.fail',

  GotWarning = 'client.users.gotWarning',

  ListRooms = 'client.rooms.list',
  RoomCreated = 'client.rooms.created',
  RoomEdited = 'client.rooms.edited',
  RoomDeleted = 'client.rooms.deleted',
  RoomJoinInfo = 'client.rooms.joinInfo',
  IncomingMessage = 'client.rooms.message',
  UserJoinedRoom = 'client.rooms.userJoined',
  UserLeftRoom = 'client.rooms.userLeft',
}
