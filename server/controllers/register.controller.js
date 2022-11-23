const User = require('../models/user')
const nodemailer = require('nodemailer')
const EmailToken = require('../models/emailToken')
const crypto = require('crypto')
const { SENDGRID_PASSWORD, SENDGRID_USERNAME } = require('../config')

const register = async (req, res) => {
  const user = new User(req.body)

  const duplicate = await User.findOne({ email: user.email }).exec()
  if (duplicate) return res.sendStatus(409)

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
          message: 'Email already exists.',
        })
      }
      res.status(400).send({ error })
    })
}

module.exports = { register }
