import {Token} from './token'

interface AuthTokenPayload {
  username: string
}

export const authTokenExpirationTime = 7 * 24 * 60 * 60 * 1000

export class AuthToken extends Token<AuthTokenPayload> {
  constructor(public username: string) {
    super(authTokenExpirationTime)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<AuthTokenPayload>(token, secret)
    return new AuthToken(decoded.username)
  }

  protected get serializedPayload() {
    return {username: this.username}
  }
}
