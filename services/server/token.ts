import * as jwt from 'jsonwebtoken'

export abstract class Token<T> {
  protected constructor(private expiresInSeconds: number) {}

  static decode<T>(token: string, secret: string) {
    try {
      return (jwt.verify(token, secret) as any) as T
    } catch (error) {
      if (error.message === 'invalid signature') throw 'Invalid token secret'
      throw 'Invalid token'
    }
  }

  sign(secret: string, expiresInSeconds = this.expiresInSeconds) {
    return jwt.sign(Object(this.serializedPayload), secret, {expiresIn: expiresInSeconds})
  }

  protected abstract serializedPayload: T
}
