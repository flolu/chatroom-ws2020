import {OutgoingClientMessageType} from '@libs/enums'
import {BanUserRequest, KickUserRequest, WarnUser, WarnUserRequest} from '@libs/schema'
import {MessageController, serverState} from './socket-controller'
import {buildSocketMessage} from './socket-message'

export const warnUser: MessageController = async (payload: WarnUserRequest) => {
  const user = serverState.onlineUsers.get(payload.userId)
  if (!user) return
  const messagePayload: WarnUser = {message: payload.message}
  const message = buildSocketMessage(OutgoingClientMessageType.GotWarning, messagePayload)
  user.send(message)
}

export const kickUser: MessageController = async (payload: KickUserRequest, socket) => {}

export const banUser: MessageController = async (payload: BanUserRequest, socket) => {}
