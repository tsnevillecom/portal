const User = require('../models/user')
const EmailToken = require('../models/emailToken')
const crypto = require('crypto')
const { ERRORS } = require('../_constants')
const { sendVerificationEmail } = require('../utils/email.util')

const verifyToken = async (req, res) => {
  const token = req.params.token

  try {
    const foundToken = await EmailToken.findOne({ token })
    if (!foundToken) {
      return res.status(401).send({
        message: ERRORS.EXPIRED_TOKEN,
      })
    }

    const user = await User.findOne({ _id: foundToken._userId })
    if (!user) {
      return res.status(404).send({
        message: ERRORS.NOT_FOUND,
      })
    }

    if (user.isVerified) {
      return res.status(409).send({
        message: ERRORS.USER_VERIFIED,
      })
    }

    user.isVerified = true
    await user.save()
    foundToken.remove()
    res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ message: ERRORS.INTERNAL_ERROR })
  }
}

const verifyEmail = async (req, res) => {
  const email = req.body.email

  const user = await User.findOne({ email }).exec()

  console.log(email, user)
  if (!user) {
    return res.status(404).send({
      message: ERRORS.NOT_FOUND,
    })
  }

  try {
    const emailToken = new EmailToken({
      _userId: user._id,
      token: crypto.randomBytes(16).toString('hex'),
    })
    console.log(token)
    const token = await emailToken.save()

    await sendVerificationEmail(email, token.token)
    res.status(200).send({ email })
  } catch (error) {
    if (error.message === ERRORS.SEND_EMAIL_FAILED) {
      return res.status(401).send({ message: error.message })
    }

    res.status(400).send({ message: ERRORS.VERIFICATION_FAILED })
  }
}

module.exports = { verifyToken, verifyEmail }
