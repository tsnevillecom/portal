const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const {
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  SECURE_COOKIE,
} = require('../config')
const { ERRORS } = require('../_constants')

const me = async (req, res) => {
  res.send(req.user)
}

const checkToken = async (req, res) => {
  res.sendStatus(200)
}

const logoutAll = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.refreshToken) {
    return res.status(401).send({ message: ERRORS.UNAUTHORIZED })
  }

  const refreshToken = cookies.refreshToken
  const foundUser = await User.findOne({
    'refreshTokens.refreshToken': refreshToken,
  }).exec()

  if (!foundUser) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: SECURE_COOKIE,
    })

    return res.status(401).send({ message: ERRORS.UNAUTHORIZED })
  }

  try {
    foundUser.refreshTokens = []
    await foundUser.save()

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: SECURE_COOKIE,
    })

    res.sendStatus(204)
  } catch (error) {
    res.status(500).send({ message: ERRORS.INTERNAL_ERROR })
  }
}

const logout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.refreshToken) return res.sendStatus(204)

  const refreshToken = cookies.refreshToken
  const foundUser = await User.findOne({
    'refreshTokens.refreshToken': refreshToken,
  }).exec()

  if (!foundUser) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: SECURE_COOKIE,
    })
    return res.sendStatus(204)
  }

  try {
    foundUser.refreshTokens = foundUser.refreshTokens.filter((rt) => {
      return rt.refreshToken !== refreshToken
    })
    await foundUser.save()

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: SECURE_COOKIE,
    })
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: ERRORS.INTERNAL_ERROR })
  }
}

const login = async (req, res) => {
  const cookies = req.cookies
  const { email, password } = req.body
  const userAgent = req.headers['user-agent'] || ''

  if (!email || !password) {
    return res.status(400).send({ message: ERRORS.EMAIL_PASSWORD_REQUIRED })
  }

  if (!validator.isEmail(email)) {
    return res.status(403).send({ message: ERRORS.INVALID_EMAIL })
  }

  const foundUser = await User.findOne({ email }).exec()
  if (!foundUser || foundUser.deleted) {
    return res.status(404).send({ message: ERRORS.NOT_FOUND })
  }

  if (!foundUser.password) {
    return res.status(409).send({ message: ERRORS.UPDATE_PASSWORD })
  }

  const isMatch = await bcrypt.compare(password, foundUser.password)
  if (!isMatch) {
    return res.status(401).send({ message: ERRORS.UNAUTHORIZED })
  }

  let newRefreshTokenArray = !cookies?.refreshToken
    ? foundUser.refreshTokens
    : foundUser.refreshTokens.filter(
        (rt) => rt.refreshToken !== cookies.refreshToken
      )

  //Detect resuse
  if (cookies?.refreshToken) {
    const foundUserWithToken = await User.findOne({
      'refreshTokens.refreshToken': cookies.refreshToken,
    }).exec()

    // Detected refresh token reuse!
    if (!foundUserWithToken) {
      console.log('attempted refresh token reuse at login!')
      newRefreshTokenArray = []
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: SECURE_COOKIE,
    })
  }

  try {
    const refreshToken = await foundUser.newRefreshToken()
    foundUser.refreshTokens = [
      ...newRefreshTokenArray,
      { refreshToken, userAgent },
    ]
    await foundUser.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: SECURE_COOKIE, //https
      sameSite: 'None', //cross-site cookie
      maxAge: REFRESH_TOKEN_EXPIRY,
    })

    const accessToken = await foundUser.newAccessToken()
    res.send({ user: foundUser, accessToken })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: ERRORS.INTERNAL_ERROR })
  }
}

const refresh = async (req, res) => {
  const userAgent = req.headers['user-agent'] || ''
  const cookies = req.cookies
  if (!cookies?.refreshToken) {
    return res.status(401).send({ message: ERRORS.UNAUTHORIZED })
  }

  const refreshToken = cookies.refreshToken
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: SECURE_COOKIE,
  })

  const foundUser = await User.findOne({
    'refreshTokens.refreshToken': refreshToken,
  }).exec()

  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: ERRORS.FORBIDDEN })
      }

      console.log('attempted refresh token reuse!')
      const _id = decoded._id
      const hackedUser = await User.findOne({
        _id,
      }).exec()
      hackedUser.refreshTokens = []
      const result = await hackedUser.save()
      console.log('hacked user', result)
    })
    return res.status(403).send({ message: ERRORS.FORBIDDEN })
  }

  const newRefreshTokenArray = foundUser.refreshTokens.filter(
    (rt) => rt.refreshToken !== refreshToken
  )

  // evaluate jwt
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    try {
      if (err) {
        console.log('expired refresh token')
        foundUser.refreshTokens = [...newRefreshTokenArray]
        await foundUser.save()
        return res.status(403).send({ message: ERRORS.FORBIDDEN })
      }

      if (foundUser._id.toString() !== decoded._id) {
        return res.status(403).send({ message: ERRORS.FORBIDDEN })
      }

      // Refresh token still valid
      const accessToken = await foundUser.newAccessToken()
      const newRefreshToken = await foundUser.newRefreshToken()

      // Saving refreshToken on current user
      foundUser.refreshTokens = [
        ...newRefreshTokenArray,
        { refreshToken: newRefreshToken, userAgent },
      ]
      await foundUser.save()

      // Creates Secure Cookie with refresh token
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true, //accessible only by web server
        secure: SECURE_COOKIE, //https
        sameSite: 'None', //cross-site cookie
        maxAge: REFRESH_TOKEN_EXPIRY, //cookie expiry: set to match rT
      })

      res.send({ user: foundUser, accessToken })
    } catch (error) {
      console.log(error)
      return res.status(403).send({ message: ERRORS.FORBIDDEN })
    }
  })
}

module.exports = {
  logout,
  logoutAll,
  login,
  refresh,
  me,
  checkToken,
}
