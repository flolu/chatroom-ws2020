export enum IncomingServerMessageType {
  CreateRoom = 'rooms.create',
  EditRoom = 'rooms.edit',
  DeleteRoom = 'rooms.delete',
}

export enum OutgoingServerMessageType {
  ListRooms = 'rooms.list',
  CreatedRoom = 'rooms.created',
  EditedRoom = 'rooms.edited',
  DeletedRoom = 'rooms.deleted',
}
