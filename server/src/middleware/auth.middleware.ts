import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from '../config'

class AuthMiddleware {
  public authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader =
        req.headers.authorization || (req.headers.Authorization as string)
      if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

      const accessToken = authHeader.split(' ')[1]
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403) //invalid token
        req['user'] = decoded.user
        req['accessToken'] = accessToken
        next()
      })
    } catch (error) {
      res.sendStatus(401)
    }
  }
}

export default AuthMiddleware
