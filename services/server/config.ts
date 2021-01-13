/**
 * Usually secrets and passwords would be read from
 * system environment variables
 * But since this won't ever run in production
 * it is not that important
 */
const tokenSecret = 'Wzt08RyXW6NErPtPoGf1FuY9KC5Ly8ei'
const databasePassword = 'K7H6cWFUgLdYO5RBfh8YWzbOCiJnMkQZ'
const adminSecret = 'lOINo6JX6y1iKSEx0NJ0XdFlhUvtCeGt'

const databaseName = 'chat'
const databaseUser = 'admin'
const databaseUrl = 'mongodb://mongodb:27017'

export const config = {
  tokenSecret,
  databasePassword,
  adminSecret,

  databaseName,
  databaseUser,
  databaseUrl,
}
