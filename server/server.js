const { PORT } = require('./config')
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
require('./db')

const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.use(express.json())

//Routes
const authRoutes = require('./routes/auth.route')
app.use(authRoutes)

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`)
})
