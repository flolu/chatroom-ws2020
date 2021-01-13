import {PublicUser} from './user.schema'

export interface SignInRequest {
  username: string
  password: string
}

export interface SignInSuccess {
  user: PublicUser
  token: string
}

export interface SignInFail {
  error: string
}

export interface AuthenticateRequest {
  token: string
}

export interface AuthenticateSuccess {
  user: PublicUser
  token: string
}

export interface AuthenticateFail {
  error: string
}
