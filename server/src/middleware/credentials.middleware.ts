import allowedOrigins from '../config/allowedOrigins'

class CredentialsMiddleware {
  public validateCredentials = (req, res, next) => {
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Credentials', true)
    }
    next()
  }
}

export default CredentialsMiddleware
