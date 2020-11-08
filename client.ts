import * as WebSocket from 'ws'

const client = new WebSocket('ws://localhost:3000')

client.onopen = () => {
  console.log('Connection opened')
  client.send('hello')
}

client.onmessage = (event) => {
  console.log('received message', event)
}
