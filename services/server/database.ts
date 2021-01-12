import {MongoClient, Db} from 'mongodb'
import {User} from '@libs/schema'

import {config} from './config'

class DatabaseAdapter {
  private client!: MongoClient
  private userCollectionName = 'users'

  constructor() {
    this.client = new MongoClient(config.databaseUrl, {
      w: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: {user: config.databaseUser, password: config.databasePassword},
    })
    this.client.connect()
    this.setupCollections()
  }

  async usersCollection() {
    const db = await this.db()
    return db.collection<User>(this.userCollectionName)
  }

  private async setupCollections() {
    const users = await this.usersCollection()
    await users.createIndexes([{key: {username: 1}, name: 'username', unique: true}])
  }

  protected async db(): Promise<Db> {
    if (!this.client.isConnected()) await this.client.connect()
    return this.client.db(config.databaseName)
  }
}

export const database = new DatabaseAdapter()
