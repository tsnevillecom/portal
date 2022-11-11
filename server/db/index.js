const mongoose = require('mongoose')

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database')
  })
  .catch((error) => {
    console.log('Failed connecting to database', error)
  })
