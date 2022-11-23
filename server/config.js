const dotenv = require('dotenv')
const result = dotenv.config()

if (result.error) {
  throw result.error
}

const environmentalVars = Object.assign({}, result.parsed, {
  ACCESS_TOKEN_EXPIRY: 2 * 60 * 1000,
  ACCESS_TOKEN_EXPIRY_SIGN: '2h',
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000,
  REFRESH_TOKEN_EXPIRY_SIGN: '7d',
  SECURE_COOKIE: true,
})

module.exports = environmentalVars
