import config from '../config'
import mongoose, { ConnectOptions } from 'mongoose'

const connectDB = async () => {
  try {
    const db = await mongoose.connect(config.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)

    console.log('Connected to database')
    return db
  } catch (error) {
    console.log('Failed connecting to database', error)
  }
}

export default connectDB
