const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = require('../config')

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

  const accessToken = authHeader.split(' ')[1]
  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log(decoded)
    if (err) return res.sendStatus(403) //invalid token
    req.user = decoded.user
    req.accessToken = accessToken
    next()
  })
}

module.exports = authenticate
