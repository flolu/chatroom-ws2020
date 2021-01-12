import {IncomingMessage} from 'http'

export interface AugmentedRequest extends IncomingMessage {
  username: string
  isAdmin: boolean
}
