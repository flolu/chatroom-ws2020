/**
 * Usually this secret would be read from
 * system environment variables
 * But since this won't ever run in production
 * it is not that important
 */
const tokenSecret = 'Wzt08RyXW6NErPtPoGf1FuY9KC5Ly8ei'

const authTokenCookieName = 'refresh_token'

export const config = {
  tokenSecret,
  authTokenCookieName,
}
