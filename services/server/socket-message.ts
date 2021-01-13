import {SocketMessage} from '@libs/schema'

export function buildSocketMessage<T>(type: string, payload: T) {
  const message: SocketMessage<T> = {type, payload}
  return JSON.stringify(message)
}
