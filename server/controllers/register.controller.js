const User = require('../models/user')
const EmailToken = require('../models/emailToken')
const crypto = require('crypto')
const { ERRORS } = require('../_constants')
const { sendVerificationEmail } = require('../utils/email.util')

const register = async (req, res) => {
  const user = new User(req.body)
  const duplicate = await User.findOne({ email: user.email }).exec()
  if (duplicate) {
    return res.status(409).send({
      message: ERRORS.USER_EXISTS,
    })
  }

  let newUser
  try {
    newUser = await user.save()
    const emailToken = new EmailToken({
      _userId: newUser._id,
      token: crypto.randomBytes(16).toString('hex'),
    })

    const token = await emailToken.save()
    await sendVerificationEmail(newUser.email, token.token)
    res.status(200).send({ user, token: token.token })
  } catch (error) {
    if (newUser) await newUser.remove()

    if (error.message === ERRORS.SEND_EMAIL_FAILED) {
      return res.status(401).send({ message: error.message })
    }

    res.status(400).send({ message: ERRORS.REGISTRATION_FAILED })
  }
}

const resendEmail = async (req, res) => {
  const email = req.body.email
  const token = req.body.token

  try {
    const foundToken = await EmailToken.findOne({ token })

    console.log(foundToken)
    if (!foundToken) {
      return res.status(404).send({
        message: ERRORS.NOT_FOUND,
      })
    }

    const user = await User.findOne({ _id: foundToken._userId, email })
    if (!user) {
      return res.status(404).send({
        message: ERRORS.NOT_FOUND,
      })
    }

    await sendVerificationEmail(email, token)
    res.status(200).send({ user })
  } catch (error) {
    if (error.message === ERRORS.SEND_EMAIL_FAILED) {
      return res.status(401).send({ message: error.message })
    }

    res.status(500).send({ message: ERRORS.INTERNAL_ERROR })
  }
}

module.exports = { register, resendEmail }
