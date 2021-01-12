export interface SocketMessage<T> {
  type: string
  payload: T
}
