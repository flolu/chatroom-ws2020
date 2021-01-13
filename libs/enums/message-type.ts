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
}

/**
 * From user-client to server
 */
export enum IncomingClientMessageeType {
  Authenticate = 'client.authenticate',
  SignIn = 'client.signIn',
}

/**
 * From server to user-client
 */
export enum OutgoingClientMessageType {
  AuthenticateDone = 'client.authenticate.done',
  AuthenticateFail = 'client.authenticate.fail',
  SignInDone = 'client.signIn.done',
  SignInFail = 'client.signIn.fail',

  GotWarning = 'users.gotWarning',
}
