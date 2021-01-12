import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'

import {ApiRoutes} from '@libs/enums'
import {adminRouter} from './admin-routes'
import {userRouter} from './user-routes'

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

  httpServer.use(`/${ApiRoutes.Admin}`, adminRouter)
  httpServer.use(`/${ApiRoutes.User}`, userRouter)

  httpServer.listen(3001, () => console.log('http server started on port 3001'))
}
