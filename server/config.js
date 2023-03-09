const dotenv = require('dotenv')
// const result = dotenv.config()
const path = require('path')

const result = dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV.trim()}.env`),
})

if (result.error) {
  throw result.error
}

const environmentalVars = {
  ...{
    // ACCESS_TOKEN_EXPIRY: 10000,
    // ACCESS_TOKEN_EXPIRY_SIGN: '10s',
    // REFRESH_TOKEN_EXPIRY: 20000, //7 * 24 * 60 * 60 * 1000,
    // REFRESH_TOKEN_EXPIRY_SIGN: '20s',
    ACCESS_TOKEN_EXPIRY: 1 * 24 * 60 * 60 * 1000, //1 day
    ACCESS_TOKEN_EXPIRY_SIGN: '1d',
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, //7 days
    REFRESH_TOKEN_EXPIRY_SIGN: '7d',
    SECURE_COOKIE: true,
    CLIENT_PORT: 3000,
  },
  ...result.parsed,
}

module.exports = environmentalVars
