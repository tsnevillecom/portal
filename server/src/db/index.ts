import config from '../config'
import mongoose, { ConnectOptions } from 'mongoose'

const connectDatabase = async () => {
  mongoose.set('strictQuery', false)

  mongoose.connection
    .once('open', () => console.log('Connected to database'))
    .on('error', (err) => console.error('Failed connecting to database:', err))

  const db = await mongoose.connect(config.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)

  console.log(db.models)
}

export default connectDatabase
