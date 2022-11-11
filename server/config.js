const dotenv = require('dotenv')
const result = dotenv.config()

if (result.error) {
  throw result.error
}

const environmentalVars = Object.assign({}, result.parsed, {
  PRIVATE_KEY: result.parsed.PRIVATE_KEY.replace(/\\n/g, '\n'),
  PUBLIC_KEY: result.parsed.PUBLIC_KEY.replace(/\\n/g, '\n'),
})

module.exports = environmentalVars
