import axios from 'axios'
import config from '../config'
import User from '../models/user.model'
import { errors } from '../_constants'
import RefreshToken from '../models/refreshToken.model'

class GoogleController {
  public login = async (req, res) => {
    const cookies = req.cookies
    const userAgent = req.headers['user-agent'] || ''

    try {
      const userInfo = await this.getGoogleUser(req, res)
      const email = userInfo.email
      const foundUser = await User.findOne({ email }).exec()
      if (!foundUser || !foundUser.active) {
        return res.status(404).send({ message: errors.NOT_FOUND })
      }

      //Detect resuse
      if (cookies?.refreshToken) {
        const foundToken = await RefreshToken.findOneAndDelete({
          token: cookies.refreshToken,
        }).exec()

        if (foundToken) console.log('token reuse (google)', foundToken)

        res.clearCookie('refreshToken', {
          httpOnly: true,
          sameSite: 'None',
          secure: config.SECURE_COOKIE,
        })
      }

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

      const newUser = await user.save()

      const newRefreshToken = await user.newRefreshToken()
      const refreshToken = await new RefreshToken({
        userId: newUser._id,
        token: newRefreshToken,
        userAgent,
      })

      await refreshToken.save()

      res.cookie('refreshToken', newRefreshToken, {
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
