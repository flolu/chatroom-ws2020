import * as WebSocket from 'ws'
import * as jwt from 'jsonwebtoken'

import {AuthTokenPayload} from '@libs/schema'
import {refreshTokenCookieName, setupHttpServer, tokenSecret} from './http-server'

setupHttpServer()

const wss = new WebSocket.Server({port: 3000})
console.log('websocket server started on port 3000')

function parseCookies(cookieHeader: string) {
  let list: Record<string, string> = {}
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=')
    list[parts!.shift()!.trim()] = decodeURI(parts.join('='))
  })
  return list
}

wss.on('connection', (ws, req) => {
  const cookies = parseCookies(req.headers.cookie || '')
  const token = cookies[refreshTokenCookieName]
  if (!token) ws.close(WebSocket.CLOSED, 'No token was provided')

  try {
    const payload = jwt.verify(token, tokenSecret) as AuthTokenPayload
    console.log(payload.username, 'connected')
  } catch (error) {
    if (!token) ws.close(WebSocket.CLOSED, 'Invalid token')
  }
})
