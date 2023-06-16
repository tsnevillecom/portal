import config from '../config'
import User from '../models/user'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errors } from '../_constants'

class AuthController {
  public me = async (req, res) => {
    res.send(req.user)
  }

  public checkToken = async (req, res) => {
    res.sendStatus(204)
  }

  public logoutAll = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) {
      return res.status(401).send({ message: errors.UNAUTHORIZED })
    }

    const refreshToken = cookies.refreshToken
    const foundUser = await User.findOne({
      'refreshTokens.refreshToken': refreshToken,
    }).exec()

    if (!foundUser) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: config.SECURE_COOKIE,
      })

      return res.status(401).send({ message: errors.UNAUTHORIZED })
    }

    try {
      foundUser.refreshTokens = []
      await foundUser.save()

      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: config.SECURE_COOKIE,
      })

      res.sendStatus(204)
    } catch (error) {
      res.status(500).send({ message: errors.INTERNAL_ERROR })
    }
  }

  public logout = async (req, res) => {
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
        secure: config.SECURE_COOKIE,
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
        secure: config.SECURE_COOKIE,
      })
      res.sendStatus(204)
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errors.INTERNAL_ERROR })
    }
  }

  public login = async (req, res) => {
    const cookies = req.cookies
    const { email, password } = req.body
    const userAgent = req.headers['user-agent'] || ''

    if (!email || !password) {
      return res.status(400).send({ message: errors.EMAIL_PASSWORD_REQUIRED })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: errors.INVALID_EMAIL })
    }

    const foundUser = await User.findOne({ email }).exec()
    if (!foundUser || foundUser.deleted) {
      return res.status(404).send({ message: errors.NOT_FOUND })
    }

    if (!foundUser.isVerified) {
      return res.status(403).send({ message: errors.USER_NOT_VERIFIED })
    }

    if (!foundUser.password) {
      return res.status(409).send({ message: errors.UPDATE_PASSWORD })
    }

    const isMatch = await bcrypt.compare(password, foundUser.password)
    if (!isMatch) {
      return res.status(401).send({ message: errors.UNAUTHORIZED })
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
        secure: config.SECURE_COOKIE,
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
        secure: config.SECURE_COOKIE, //https
        sameSite: 'None', //cross-site cookie
        maxAge: config.REFRESH_TOKEN_EXPIRY,
      })

      const accessToken = await foundUser.newAccessToken()

      res.send({ user: foundUser, accessToken })
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errors.INTERNAL_ERROR })
    }
  }

  public refresh = async (req, res) => {
    const userAgent = req.headers['user-agent'] || ''
    const cookies = req.cookies
    if (!cookies?.refreshToken) {
      return res.status(401).send({ message: errors.UNAUTHORIZED })
    }

    const refreshToken = cookies.refreshToken
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: config.SECURE_COOKIE,
    })

    const foundUser = await User.findOne({
      'refreshTokens.refreshToken': refreshToken,
    }).exec()

    // Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        config.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            return res.status(403).send({ message: errors.FORBIDDEN })
          }

          console.log('attempted refresh token reuse!')
          const _id = decoded._id
          const hackedUser = await User.findOne({
            _id,
          }).exec()

          if (hackedUser) {
            hackedUser.refreshTokens = []
            const result = await hackedUser.save()
            console.log('hacked user', result)
          }
        }
      )

      return res.status(403).send({ message: errors.FORBIDDEN })
    }

    const newRefreshTokenArray = foundUser.refreshTokens.filter(
      (rt) => rt.refreshToken !== refreshToken
    )

    // evaluate jwt
    jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        try {
          if (err) {
            console.log('expired refresh token')
            foundUser.refreshTokens = [...newRefreshTokenArray]
            await foundUser.save()
            return res.status(403).send({ message: errors.FORBIDDEN })
          }

          if (foundUser._id.toString() !== decoded._id) {
            return res.status(403).send({ message: errors.FORBIDDEN })
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
            secure: config.SECURE_COOKIE, //https
            sameSite: 'None', //cross-site cookie
            maxAge: config.REFRESH_TOKEN_EXPIRY, //cookie expiry: set to match rT
          })

          res.send({ user: foundUser, accessToken })
        } catch (error) {
          console.log(error)
          return res.status(500).send({ message: errors.INTERNAL_ERROR })
        }
      }
    )
  }
}

export default AuthController
