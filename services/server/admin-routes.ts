import * as express from 'express'

import {AdminApiRoutes} from '@libs/enums'
import {AdminSecretRequest} from '@libs/schema'
import {config} from './config'
import {cookieOptions} from './utils'

export const adminRouter = express.Router()

function checkSecretAndSendResponse(secret: string, res: express.Response) {
  if (secret === config.adminSecret) {
    res.cookie(config.adminSecretCookieName, secret, cookieOptions)
    res.status(200).send()
  } else {
    res.cookie(config.adminSecretCookieName, '')
    res.status(401).send('Invalid secret')
  }
}

adminRouter.post(`/${AdminApiRoutes.SignIn}`, (req, res) => {
  const {secret} = req.body as AdminSecretRequest
  checkSecretAndSendResponse(secret, res)
})

adminRouter.post(`/${AdminApiRoutes.Authenticate}`, (req, res) => {
  const secret = req.cookies[config.adminSecretCookieName]
  checkSecretAndSendResponse(secret, res)
})
