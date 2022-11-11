import User from '../models/user'
import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from '../config'

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('no authHeader')
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })

      const user = await User.findOne({
        _id: decoded.UserInfo.id,
        userName: decoded.UserInfo.userName,
      })

      if (!user) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      req.token = token
      req.user = user
      next()
    })
  } catch (error) {
    res.status(401).send('Unauthorized')
  }
}

module.exports = authenticate
