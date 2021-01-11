export interface AuthTokenPayload {
  username: string
}

export interface AuthenticatedResponse {
  username: string
}

export interface SignInRequest {
  username: string
  password: string
}
