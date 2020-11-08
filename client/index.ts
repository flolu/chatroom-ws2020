import * as WebSocket from 'ws'

import {Message, MessageType} from '../shared'
import {ChatClient} from './chat-client'

const socket = new WebSocket('ws://localhost:3000')
const chat = new ChatClient(socket)

socket.onopen = () => chat.init()
socket.onmessage = event => {
  const data: Message<any> = JSON.parse(event.data.toString())
  if (data.type === MessageType.UserMessage) chat.onMessage(data.payload)
}
