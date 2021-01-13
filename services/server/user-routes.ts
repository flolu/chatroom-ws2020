import * as express from 'express'
import * as bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'

import {SignInRequest, User} from '@libs/schema'
import {UserApiRoutes} from '@libs/enums'
import {AuthToken} from './auth-token'
import {config} from './config'
import {database} from './database'
import {cookieOptions} from './utils'

export const userRouter = express.Router()

userRouter.post(`/${UserApiRoutes.SignIn}`, async (req, res) => {
  const {username, password} = req.body as SignInRequest
  const collection = await database.usersCollection()
  const user = await collection.findOne({username})

  if (user) {
    /**
     * Sign in as an existing user
     */
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).send('Invalid password')

    const token = new AuthToken(user.id)
    res.cookie(config.authTokenCookieName, token.sign(config.tokenSecret), cookieOptions)
    return res.status(200).json({username})
  } else {
    /**
     * Create a new user
     */
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const newUser: User = {id: uuidv4(), username, passwordHash}
    await collection.insertOne(newUser)

    const token = new AuthToken(newUser.id)
    res.cookie(config.authTokenCookieName, token.sign(config.tokenSecret), cookieOptions)
    return res.status(200).json({username})
  }
})

userRouter.post(`/${UserApiRoutes.Refresh}`, (req, res) => {
  const currentToken = req.cookies[config.authTokenCookieName]
  if (!currentToken) return res.status(400).send('No auth token was provided')

  try {
    const current = AuthToken.fromString(currentToken, config.tokenSecret)
    const refreshed = new AuthToken(current.userId)
    const refreshedToken = refreshed.sign(config.tokenSecret)
    res.cookie(config.authTokenCookieName, refreshedToken, cookieOptions)
    res.status(200).json({username: refreshed.userId})
  } catch (error) {
    res.cookie(config.authTokenCookieName, '')
    return res.status(400).send('Auth token invalid')
  }
})
