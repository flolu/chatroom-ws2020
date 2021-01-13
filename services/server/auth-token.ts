import {Token} from './token'

interface AuthTokenPayload {
  userId: string
}

export const authTokenExpirationTime = 7 * 24 * 60 * 60 * 1000

export class AuthToken extends Token<AuthTokenPayload> {
  constructor(public userId: string) {
    super(authTokenExpirationTime)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<AuthTokenPayload>(token, secret)
    return new AuthToken(decoded.userId)
  }

  protected get serializedPayload() {
    return {userId: this.userId}
  }
}
