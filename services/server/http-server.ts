import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'

import {SignInRequest} from '@libs/schema'
import {AuthToken, authTokenExpirationTime} from './auth-token'
import {config} from './config'

const cookieOptions = {
  httpOnly: true,
  maxAge: authTokenExpirationTime,
}

export function setupHttpServer() {
  const httpServer = express()
  httpServer.use(
    cors({
      origin: (_origin: any, callback: any) => callback(null, true),
      credentials: true,
    })
  )
  httpServer.use(bodyParser.json())
  httpServer.use(cookieParser())

  httpServer.post('/refresh', (req, res) => {
    const currentToken = req.cookies[config.authTokenCookieName]
    if (!currentToken) return res.status(400).send('No auth token was provided')

    try {
      const current = AuthToken.fromString(currentToken, config.tokenSecret)
      const refreshed = new AuthToken(current.username)
      const refreshedToken = refreshed.sign(config.tokenSecret)
      res.cookie(config.authTokenCookieName, refreshedToken, cookieOptions)
      res.status(200).json({username: refreshed.username})
    } catch (error) {
      return res.status(400).send('Auth token invalid')
    }
  })

  httpServer.post('/signin', (req, res) => {
    const {username, password} = req.body as SignInRequest
    console.log('signin', {username, password})
    // TODO either sign up or sign in

    const token = new AuthToken(username)
    res.cookie(config.authTokenCookieName, token.sign(config.tokenSecret), cookieOptions)

    return res.status(200).json({username})
  })

  httpServer.listen(3001, () => console.log('http server started on port 3001'))
}
