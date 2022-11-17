const mongoose = require('mongoose')
const { DATABASE_URL } = require('../config')

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    console.log('Connected to database')
  } catch (error) {
    console.log('Failed connecting to database', error)
  }
}

module.exports = connectDB
