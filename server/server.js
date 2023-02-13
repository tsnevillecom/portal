const { PORT, HOST } = require('./config')
const bodyParser = require('body-parser')
const express = require('express')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const connectDB = require('./db')

connectDB()
const app = express()

// app.use(logger)

app.use(credentials)
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.use(express.json())

//Routes
app.use('/auth', require('./routes/auth.route'))
app.use('/register', require('./routes/register.route'))
app.use('/verify', require('./routes/verify.route'))
app.use('/teams', require('./routes/teams.route'))
app.use('/google', require('./routes/google.route'))

app.listen(PORT, HOST, function () {
  console.log(`App listening on http://${HOST}:${PORT}`)
})
