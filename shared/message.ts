export enum MessageType {
  Authentication,
  UserMessage,
}

export interface Message<T> {
  type: MessageType
  payload: T
}
