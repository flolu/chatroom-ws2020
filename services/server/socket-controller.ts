import * as WebSocket from 'ws'

import {SocketMessage} from '@libs/schema'
import {IncomingServerMessageType} from '@libs/enums'
import {AugmentedRequest} from './models'
import {createRoom, deleteRoom, editRoom} from './room-controllers'

export type MessageController = (ws: WebSocket, payload: any) => void

const controllers: Record<string, MessageController> = {
  [IncomingServerMessageType.CreateRoom]: createRoom,
  [IncomingServerMessageType.EditRoom]: editRoom,
  [IncomingServerMessageType.DeleteRoom]: deleteRoom,
}

export function socketController(ws: WebSocket, req: AugmentedRequest) {
  const {username, isAdmin} = req as AugmentedRequest
  console.log('client connected', {username, isAdmin})

  ws.on('message', message => {
    const {type, payload} = JSON.parse(message.toString()) as SocketMessage<any>
    const controller = controllers[type]
    if (controller) return controller(ws, payload)

    console.log('Unkown incoming message type', type)
  })
}
