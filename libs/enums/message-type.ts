export enum IncomingServerMessageType {
  CreateRoom = 'rooms.create',
  EditRoom = 'rooms.edit',
  DeleteRoom = 'rooms.delete',
}

export enum OutgoingServerMessageType {
  CreatedRoom = 'rooms.created',
  EditedRoom = 'rooms.edited',
  DeletedRoom = 'rooms.deleted',
}
