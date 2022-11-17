const User = require('../models/user')
const EmailToken = require('../models/emailToken')

const verifyToken = async (req, res) => {
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
}

module.exports = { verifyToken }
