import connectDatabase from '../db'
import mongoose from 'mongoose'
import UsersSeed from './users.seed'
import ChannelsSeed from './channels.seed'
import CompaniesSeed from './companies.seed'
import LocationsSeed from './locations.seed'

class Seed {
  public async initialize() {
    connectDatabase()
    await this.seed()
  }

  private seed(): Promise<any> {
    const db = mongoose.connection

    return new Promise((resolve) => {
      db.once('open', async () => {
        await new UsersSeed().seed()
        await new ChannelsSeed().seed()
        await new CompaniesSeed().seed()
        await new LocationsSeed().seed()
        db.close()
        resolve(null)
      })
    })
  }
}

const seed = new Seed()

seed.initialize().then(() => {
  console.log('Seeding complete')
  process.exit()
})
