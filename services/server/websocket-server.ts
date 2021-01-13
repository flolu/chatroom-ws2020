import * as WebSocket from 'ws'

import {AugmentedRequest} from './models'
import * as utils from './utils'
import {AuthToken} from './auth-token'
import {config} from './config'
import {socketController} from './socket-controller'

export function setupWebSocketServer() {
  const wss = new WebSocket.Server({
    port: 3000,
    verifyClient: ({req}, callback) => {
      const cookies = utils.parseCookies(req.headers.cookie)
      const adminSecret = cookies[config.adminSecretCookieName]
      if (adminSecret) {
        /**
         * Handle admin authentication
         */
        if (adminSecret === config.adminSecret) {
          ;(req as AugmentedRequest).isAdmin = true
          return callback(true)
        }
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

  wss.on('connection', socketController)
}
