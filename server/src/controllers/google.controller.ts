import axios from 'axios'
import config from '../config'
import User from '../models/user.model'
import { errors } from '../_constants'

class GoogleController {
  public login = async (req, res) => {
    const cookies = req.cookies
    const userAgent = req.headers['user-agent'] || ''

    try {
      const userInfo = await this.getGoogleUser(req, res)
      const email = userInfo.email
      const foundUser = await User.findOne({ email }).exec()
      if (!foundUser || foundUser.deleted) {
        return res.status(404).send({ message: errors.NOT_FOUND })
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
          console.log('attempted refresh token reuse at login! (google)')
          newRefreshTokenArray = []
        }

        res.clearCookie('refreshToken', {
          httpOnly: true,
          sameSite: 'None',
          secure: config.SECURE_COOKIE,
        })
      }

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
      return res.status(500).send({ error, message: errors.INTERNAL_ERROR })
    }
  }

  private getGoogleUser = async (req, res) => {
    const { googleAccessToken } = req.body

    try {
      const googleResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            'Accept-Encoding': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      return googleResponse.data
    } catch (error) {
      return res.status(405).send({ error, message: errors.GOOGLE_ERROR })
    }
  }

  public register = async (req, res) => {
    const userAgent = req.headers['user-agent'] || ''

    try {
      const googleUser = await this.getGoogleUser(req, res)
      const existingUser = await User.findOne({ email: googleUser.email })
      if (existingUser) {
        return res.status(409).send({
          message: errors.USER_EXISTS,
        })
      }

      const user = new User({
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        isVerified: googleUser.email_verified,
      })

      const refreshToken = await user.newRefreshToken()
      user.refreshTokens = [{ refreshToken, userAgent }]

      const newUser = await user.save()

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: config.SECURE_COOKIE, //https
        sameSite: 'None', //cross-site cookie
        maxAge: config.REFRESH_TOKEN_EXPIRY,
      })

      const accessToken = await newUser.newAccessToken()
      res.status(200).send({ user: newUser, accessToken })
    } catch (error) {
      return res
        .status(500)
        .send({ error, message: errors.REGISTRATION_FAILED })
    }
  }
}

export default GoogleController
