const User = require('../models/user')
const axios = require('axios')
const { REFRESH_TOKEN_EXPIRY, SECURE_COOKIE } = require('../config')

const login = async (req, res) => {
  const cookies = req.cookies
  const userAgent = req.headers['user-agent'] || ''
  const { googleAccessToken } = req.body

  try {
    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          'Accept-Encoding': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )

    const email = userInfo.data.email
    const foundUser = await User.findOne({ email }).exec()
    if (!foundUser || foundUser.deleted) {
      return res.sendStatus(401) //Unauthorized
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
    res.status(401)
  }
}

module.exports = {
  login,
}
