import * as WebSocket from 'ws'

import {SocketMessage} from '@libs/schema'
import {setupHttpServer} from './http-server'
import {AugmentedRequest} from './models'
import * as utils from './utils'
import {AuthToken} from './auth-token'
import {config} from './config'

const wss = new WebSocket.Server({
  port: 3000,
  verifyClient: ({req}, callback) => {
    const cookies = utils.parseCookies(req.headers.cookie)
    const adminSecret = cookies[config.adminSecretCookieName]
    if (adminSecret) {
      /**
       * Handle admin authentication
       */
      if (adminSecret === config.adminSecret) return callback(true)
    }

    const token = cookies[config.authTokenCookieName]
    if (!token) return callback(false, 401, 'No auth token provided')

    /**
     * Handle user authentication
     */
    try {
      const authToken = AuthToken.fromString(token, config.tokenSecret)
      ;(req as AugmentedRequest).username = authToken.username
      ;(req as AugmentedRequest).isAdmin = false
      callback(true)
    } catch (error) {
      callback(false, 401, 'Invalid auth token provded')
    }
  },
})
console.log('websocket server started on port 3000')

wss.on('connection', (ws, req) => {
  const {username, isAdmin} = req as AugmentedRequest
  console.log('client connected', {username, isAdmin})

  ws.on('message', message => {
    const {type, payload} = JSON.parse(message.toString()) as SocketMessage<any>
    console.log({type, payload})
  })

  // TODO remove eventually
  ws.send(JSON.stringify({type: 'test', payload: 'hello'}))
})

/**
 * The entire client to server communication uses
 * web sockets. However for authentication I use
 * simple HTTP communication
 *
 * That's because it's not possible to set cookies
 * with a web socket connection
 * But cookies are required for secure, persistent
 * user authentication
 */
setupHttpServer()
