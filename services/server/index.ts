import * as WebSocket from 'ws'

import {setupHttpServer} from './http-server'
import {AugmentedRequest} from './models'
import * as utils from './utils'
import {AuthToken} from './auth-token'
import {config} from './config'

const wss = new WebSocket.Server({
  port: 3000,
  verifyClient: ({req}, callback) => {
    // TODO handle admin authentication
    const cookies = utils.parseCookies(req.headers.cookie)
    const token = cookies[config.authTokenCookieName]
    if (!token) return callback(false, 401, 'No auth token provided')

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
