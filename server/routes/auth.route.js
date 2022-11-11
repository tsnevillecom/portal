const express = require('express')
const router = new express.Router()
const authenticate = require('../middleware/auth')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

import { SENDGRID_PASSWORD, SENDGRID_USERNAME } from '../config'

const EmailToken = require('../models/emailToken')

router.get('/me', authenticate, async (req, res) => {
  res.send(req.user)
})

router.get('/checkToken', authenticate, async (req, res) => {
  res.sendStatus(200)
})

router.post('/logout', authenticate, async (req, res) => {
  const cookies = req.cookies
  console.log(cookies)
  if (!cookies?.refreshToken) return res.sendStatus(204)

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  })

  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  })

  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send({ message: 'Cookies cleared' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})

router.post('/logoutall', authenticate, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send({ error })
  }
})

router.post('/login', async (req, res) => {
  const { userName, password } = req.body
  const userAgent = req.headers['user-agent'] || ''

  if (!userName || !password) {
    return res.status(400).send({ message: 'All fields required' })
  }

  try {
    const user = await User.findOne({ userName })
    if (!user || user.deleted) {
      return res.status(401).send({ message: 'Unauthorized' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).send({ message: 'Unauthorized' })
    }

    const accessToken = await user.newAccessToken(userAgent)
    const refreshToken = await user.newRefreshToken()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: false, //https
      sameSite: 'None', //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    })

    res.cookie('accessToken', accessToken, {
      httpOnly: true, //accessible only by web server
      secure: false, //https
      sameSite: 'None', //cross-site cookie
      maxAge: 2 * 60 * 1000, //cookie expiry: set to match rT
    })

    res.send({ user, accessToken })
  } catch (error) {
    console.log(error)
    res.status(500).send({ meesage: 'Internal server error' })
  }
})

router.post('/register', async (req, res) => {
  const user = new User(req.body)

  user
    .save()
    .then((user) => {
      const emailToken = new EmailToken({
        _userId: user._id,
        token: crypto.randomBytes(16).toString('hex'),
      })

      emailToken
        .save()
        .then((token) => {
          const transporter = nodemailer.createTransport({
            service: 'Sendgrid',
            auth: {
              user: SENDGRID_USERNAME,
              pass: SENDGRID_PASSWORD,
            },
          })

          const mailOptions = {
            from: 'tsneville@gmail.com',
            to: user.email,
            subject: 'Account Verification Token',
            text:
              'Hello,\n\n' +
              'Please verify your account by clicking the link: \nhttp://' +
              req.headers.host +
              '/verify/' +
              token.token +
              '.\n',
          }

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              return res.status(409).send({
                user,
                error: 'Could not send verification email. ' + err.message,
              })
            }

            res.status(200).send({
              user,
              token: token.token,
              success:
                'A verification email has been sent to ' + user.email + '.',
            })
          })
        })
        .catch((error) => {
          res.status(409).send({
            user,
            message: 'Could not send verification email.',
          })
        })
    })
    .catch((error) => {
      if (error.name === 'MongoError' && error.code === 11000) {
        return res.status(400).send({
          success: false,
          message: 'Username or email already exists.',
        })
      }
      res.status(400).send({ error })
    })
})

router.get('/verify/:token', async (req, res) => {
  const token = req.params.token
  debugger
  EmailToken.findOne({ token }, (err, token) => {
    if (!token)
      return res.status(400).send({
        error:
          'We were unable to find a valid token. Your token may have expired.',
      })

    //If token found, find a matching user
    User.findOne({ _id: token._userId }, (err, user) => {
      if (!user)
        return res.status(400).send({
          error: 'We were unable to find a user for this token.',
        })

      if (user.isVerified)
        return res.status(400).send({
          error: 'This account has already been verified. Please login.',
        })

      // Verify and save the user
      user.isVerified = true
      user.save((error) => {
        if (error) {
          return res.status(500).send({
            error: "We've encountered a problem verifying this account.",
          })
        }
        res.status(200).send({
          user,
        })
      })
    })
  })
})

module.exports = router
