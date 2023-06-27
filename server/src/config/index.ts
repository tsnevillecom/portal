import dotenv from 'dotenv'
import path from 'path'

const result = dotenv.config({
  path: path.resolve(__dirname, `../${process.env.NODE_ENV.trim()}.env`),
})

if (result.error) {
  throw result.error
}

const environmentalVars = {
  // ACCESS_TOKEN_EXPIRY: 10000,
  // ACCESS_TOKEN_EXPIRY_SIGN: 10,
  // REFRESH_TOKEN_EXPIRY: 20000,
  // REFRESH_TOKEN_EXPIRY_SIGN: 20,
  ACCESS_TOKEN_EXPIRY: 86400000, //1 day (ms)
  ACCESS_TOKEN_EXPIRY_SIGN: 86400, //1 day (sec)
  REFRESH_TOKEN_EXPIRY: 604800000, //7 days (ms)
  REFRESH_TOKEN_EXPIRY_SIGN: 604800, //7 days (sec)
  SECURE_COOKIE: true,
  CLIENT_PORT: 3000,
  REFRESH_TOKEN_SECRET: null,
  ACCESS_TOKEN_SECRET: null,
  SESSION_SECRET: null,
  DATABASE_URL: null,
  MAILGUN_API_KEY: null,
  MAILGUN_DOMAIN: null,
  HOST: null,
  PORT: null,
  SUPER_ADMIN_PASSWORD: null,
  ...result.parsed,
}

export default { ...environmentalVars }
