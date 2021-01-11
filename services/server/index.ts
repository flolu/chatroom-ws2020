import * as WebSocket from 'ws'

const wss = new WebSocket.Server({port: 3000})
console.log('server started on port 3000')

wss.on('connection', ws => {
  console.log('client connected')
})
