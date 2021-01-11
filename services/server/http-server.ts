import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import * as jwt from 'jsonwebtoken'

import {AuthTokenPayload, SignInRequest} from '@libs/schema'

/**
 * Usually this secret would be read from
 * system environment variables
 * But since this won't ever run in production
 * it is not that important
 */
export const tokenSecret = 'Wzt08RyXW6NErPtPoGf1FuY9KC5Ly8ei'
export const refreshTokenCookieName = 'refresh_token'
const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
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
    const currentToken = req.cookies[refreshTokenCookieName]
    if (!currentToken) return res.status(400).send('No token was provided')

    try {
      const payload = jwt.verify(currentToken, tokenSecret) as AuthTokenPayload
      const refreshedToken = jwt.sign({username: payload.username}, tokenSecret)
      res.cookie(refreshTokenCookieName, refreshedToken, cookieOptions)
      res.status(200).json({username: payload.username})
    } catch (error) {
      return res.status(400).send('Token invalid')
    }
  })

  httpServer.post('/signin', (req, res) => {
    const {username, password} = req.body as SignInRequest
    console.log('signin', {username, password})
    // TODO actual sign in logic!

    const refreshedToken = jwt.sign({username}, tokenSecret)
    res.cookie(refreshTokenCookieName, refreshedToken, cookieOptions)

    return res.status(200).json({username})
  })

  httpServer.listen(3001, () => console.log('http server started on port 3001'))
}
