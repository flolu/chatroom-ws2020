import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'

const server = http.createServer(express)
const wss = new WebSocket.Server({server})

wss.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log('received message', msg)
  })
})

server.listen(3000, () => console.log('Server started'))
