const User = require('../models/user')
const PasswordToken = require('../models/passwordToken')
const crypto = require('crypto')
const { ERRORS } = require('../_constants')
const { sendPasswordResetEmail } = require('../utils/email.util')
const { ObjectId } = require('mongodb')

const resetPassword = async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email }).exec()
  if (!user) {
    return res.status(404).send({
      message: ERRORS.NOT_FOUND,
    })
  }

  let token
  try {
    const passwordToken = new PasswordToken({
      _userId: user._id,
      token: crypto.randomBytes(16).toString('hex'),
    })

    token = await passwordToken.save()
    await sendPasswordResetEmail(email, token.token)
    res.status(200).send({ email })
  } catch (error) {
    if (token) await token.remove()

    if (error.message === ERRORS.SEND_EMAIL_FAILED) {
      return res.status(401).send({ message: error.message })
    }

    res.status(400).send({ message: ERRORS.INTERNAL_ERROR })
  }
}

const resetPasswordVerify = async (req, res) => {
  const token = req.body.token
  const password = req.body.password

  try {
    const foundToken = await PasswordToken.findOne({ token })
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

    user.password = password
    user.isVerified = true
    await user.save()

    PasswordToken.deleteMany(
      {
        _userId: {
          $in: [user._id],
        },
      },
      (err, result) => console.log(err, result)
    )
    res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ message: ERRORS.INTERNAL_ERROR })
  }
}

module.exports = { resetPassword, resetPasswordVerify }
