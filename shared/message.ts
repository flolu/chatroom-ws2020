export enum MessageType {
  UserMessage,
}

export interface Message<T> {
  type: MessageType
  payload: T
}
