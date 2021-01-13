import {MongoClient, Db} from 'mongodb'
import {Room, User} from '@libs/schema'

import {config} from './config'

class DatabaseAdapter {
  private client!: MongoClient

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
    return db.collection<User>('users')
  }

  async roomsCollection() {
    const db = await this.db()
    return db.collection<Room>('rooms')
  }

  private async setupCollections() {
    const [users, rooms] = await Promise.all([this.usersCollection(), this.roomsCollection()])

    await users.createIndexes([{key: {username: 1}, name: 'username', unique: true}])
    await rooms.createIndexes([{key: {id: 1}, name: 'id', unique: true}])
  }

  protected async db(): Promise<Db> {
    if (!this.client.isConnected()) await this.client.connect()
    return this.client.db(config.databaseName)
  }
}

export const database = new DatabaseAdapter()
