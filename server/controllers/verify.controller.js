const User = require('../models/user')
const EmailToken = require('../models/emailToken')
const { ERRORS } = require('../_constants')

const verifyToken = async (req, res) => {
  const token = req.params.token
  console.log(token)

  try {
    const foundToken = await EmailToken.findOne({ token })

    console.log(foundToken)
    if (!foundToken) {
      return res.status(400).send({
        message: ERRORS.EXPIRED_TOKEN,
      })
    }

    const user = await User.findOne({ _id: foundToken._userId })
    if (!user) {
      return res.status(400).send({
        message: ERRORS.NOT_FOUND,
      })
    }

    if (user.isVerified) {
      return res.status(400).send({
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

module.exports = { verifyToken }
