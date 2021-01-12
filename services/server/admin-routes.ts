import * as express from 'express'

import {AdminApiRoutes} from '@libs/enums'
import {AdminSignInRequest} from '@libs/schema'
import {config} from './config'
import {cookieOptions} from './utils'

export const adminRouter = express.Router()

adminRouter.post(`/${AdminApiRoutes.Authenticate}`, (req, res) => {
  const {secret} = req.body as AdminSignInRequest
  if (secret === config.adminSecret) {
    res.cookie(config.adminSecretCookieName, secret, cookieOptions)
    res.status(200).send()
  } else {
    res.cookie(config.adminSecretCookieName, '')
    res.status(401).send('Invalid secret')
  }
})
