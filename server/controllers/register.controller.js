const User = require('../models/user')
const nodemailer = require('nodemailer')
const mailgun = require('nodemailer-mailgun-transport')
const EmailToken = require('../models/emailToken')
const crypto = require('crypto')
const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = require('../config')
const { ERRORS } = require('../_constants')

const register = async (req, res) => {
  const user = new User(req.body)

  const duplicate = await User.findOne({ email: user.email }).exec()
  if (duplicate)
    return res.status(409).send({
      message: ERRORS.REGISTRATION_FAILED,
    })

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
          const auth = {
            auth: {
              api_key: MAILGUN_API_KEY,
              domain: MAILGUN_DOMAIN,
            },
          }

          const transporter = nodemailer.createTransport(mailgun(auth))

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
            console.log(err, info)

            if (err) {
              return res.status(409).send({
                user,
                error: err,
                message: ERRORS.REGISTRATION_FAILED,
              })
            }

            res.status(200).send({
              user,
              token: token.token,
            })
          })
        })
        .catch((error) => {
          console.log(error)
          res.status(409).send({
            user,
            message: ERRORS.SEND_EMAIL_FAILED,
          })
        })
    })
    .catch((error) => {
      res.status(400).send({ error, message: ERRORS.REGISTRATION_FAILED })
    })
}

module.exports = { register }
