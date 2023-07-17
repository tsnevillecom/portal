import config from '../config'
import User from '../models/user.model'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errors } from '../_constants'
import RefreshToken from '../models/refreshToken.model'

class AuthController {
  public me = async (req, res) => {
    res.send(req.user)
  }

  public checkSession = async (req, res) => {
    res.sendStatus(204)
  }

  public logoutAll = async (req, res) => {
    const user = req.user

    try {
      const foundTokens = await RefreshToken.deleteMany({
        userId: user._id,
      }).exec()

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
    const token = req.session.refreshToken
    const user = req.session.user

    console.log(req.session)

    if (!token || !user) return res.sendStatus(204)

    try {
      await RefreshToken.findOneAndDelete({
        token,
        userId: user._id,
      }).exec()

      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: config.SECURE_COOKIE,
      })

      req.session.destroy()
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

    //Detect resuse
    if (cookies?.refreshToken) {
      const foundToken = await RefreshToken.findOneAndDelete({
        token: cookies.refreshToken,
      }).exec()

      console.log(foundToken)

      if (foundToken) console.log('token reuse', foundToken)

      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: config.SECURE_COOKIE,
      })

      console.log(res)
    }

    try {
      const newRefreshToken = await foundUser.newRefreshToken()
      const refreshToken = await new RefreshToken({
        userId: foundUser._id,
        token: newRefreshToken,
        userAgent,
      })

      await refreshToken.save()

      req.session.refreshToken = newRefreshToken
      req.session.user = foundUser

      res.cookie('refreshToken', newRefreshToken, {
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

    console.log(req.session)

    if (!cookies?.refreshToken) {
      return res.status(401).send({ message: errors.UNAUTHORIZED })
    }

    const refreshTokenCookie = cookies.refreshToken

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: config.SECURE_COOKIE,
    })

    const foundRefreshToken = await RefreshToken.findOne({
      token: refreshTokenCookie,
    }).exec()

    // Detected refresh token reuse!
    if (!foundRefreshToken) {
      jwt.verify(
        refreshTokenCookie,
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
            console.log('hacked user', hackedUser)
            await RefreshToken.deleteMany({
              user: _id,
            }).exec()
          }
        }
      )

      req.session.destroy()
      return res.status(403).send({ message: errors.FORBIDDEN })
    }

    const foundUser = await User.findOne({
      _id: foundRefreshToken?.userId,
    }).exec()

    // evaluate jwt
    jwt.verify(
      foundRefreshToken.token,
      config.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        try {
          if (err) {
            console.log('expired refresh token')
            return res.status(403).send({ message: errors.FORBIDDEN })
          }

          await foundRefreshToken.delete()

          if (foundUser._id.toString() !== decoded._id) {
            return res.status(403).send({ message: errors.FORBIDDEN })
          }
          const accessToken = await foundUser.newAccessToken()
          const newRefreshToken = await foundUser.newRefreshToken()

          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true, //accessible only by web server
            secure: config.SECURE_COOKIE, //https
            sameSite: 'None', //cross-site cookie
            maxAge: config.REFRESH_TOKEN_EXPIRY,
          })

          const refreshToken = await new RefreshToken({
            userId: foundUser._id,
            token: newRefreshToken,
            userAgent,
          })

          req.session.refreshToken = newRefreshToken

          await refreshToken.save()
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
