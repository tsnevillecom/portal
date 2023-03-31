import config from '../config'
import mongoose, { ConnectOptions } from 'mongoose'

const connectDatabase = () => {
  mongoose.connect(config.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)

  mongoose.connection
    .once('open', () => console.log('Connected to database'))
    .on('error', (err) => console.error('Failed connecting to database:', err))
}

export default connectDatabase
