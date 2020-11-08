import * as WebSocket from 'ws'

import {ChatClient} from './chat-client'

const socket = new WebSocket('ws://localhost:3000')
const chat = new ChatClient(socket)

socket.onopen = () => chat.init()
socket.onmessage = event => chat.message(event)
