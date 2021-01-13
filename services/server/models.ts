import {IncomingMessage} from 'http'

export interface AugmentedRequest extends IncomingMessage {
  userId: string
  isAdmin: boolean
}
