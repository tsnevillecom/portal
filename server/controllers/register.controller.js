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
      message: ERRORS.REGISTRATION_FAILED,
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
    // await sendVerificationEmail(req, newUser.email, token.token)
    await sendVerificationEmail(newUser.email, token.token)
    res.status(200).send({ user })
  } catch (error) {
    if (newUser) await newUser.remove()

    if (error.message === ERRORS.SEND_EMAIL_FAILED) {
      return res.status(401).send({ message: error.message })
    }

    res.status(400).send({ message: ERRORS.REGISTRATION_FAILED })
  }
}

module.exports = { register }
