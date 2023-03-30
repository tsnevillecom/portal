import dotenv from 'dotenv'
import path from 'path'

const result = dotenv.config({
  path: path.resolve(__dirname, `../${process.env.NODE_ENV.trim()}.env`),
})

if (result.error) {
  throw result.error
}

interface IEnvironmentalVars {
  ACCESS_TOKEN_EXPIRY: number
  ACCESS_TOKEN_EXPIRY_SIGN: string
  REFRESH_TOKEN_EXPIRY: number
  REFRESH_TOKEN_EXPIRY_SIGN: string
  SECURE_COOKIE: boolean
  CLIENT_PORT: number
  REFRESH_TOKEN_SECRET: string
  ACCESS_TOKEN_SECRET: string
  DATABASE_URL: string
  MAILGUN_API_KEY: string
  MAILGUN_DOMAIN: string
  HOST: number
  PORT: number
}

const environmentalVars = {
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
  REFRESH_TOKEN_SECRET: null,
  ACCESS_TOKEN_SECRET: null,
  DATABASE_URL: null,
  MAILGUN_API_KEY: null,
  MAILGUN_DOMAIN: null,
  HOST: null,
  PORT: null,
  ...result.parsed,
}

export default { ...environmentalVars }
