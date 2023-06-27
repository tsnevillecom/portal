import EmailToken from '../models/emailToken.model'
import User from '../models/user.model'
import crypto from 'crypto'
import { errors } from '../_constants'
import EmailUtil from '../utils/email.util'

class VerifyController {
  private sendVerificationEmail = new EmailUtil().sendVerificationEmail

  public verifyToken = async (req, res) => {
    const token = req.params.token

    try {
      const foundToken = await EmailToken.findOne({ token })
      if (!foundToken) {
        return res.status(401).send({
          message: errors.EXPIRED_TOKEN,
        })
      }

      const user = await User.findOne({ _id: foundToken._userId })
      if (!user) {
        foundToken.remove()
        return res.status(404).send({
          message: errors.NOT_FOUND,
        })
      }

      if (user.isVerified) {
        foundToken.remove()
        return res.status(409).send({
          message: errors.USER_VERIFIED,
        })
      }

      user.isVerified = true
      await user.save()
      foundToken.remove()
      res.status(200).send({ user })
    } catch (error) {
      res.status(500).send({ message: errors.INTERNAL_ERROR })
    }
  }

  public verifyEmail = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({ email }).exec()

    if (!user) {
      return res.status(404).send({
        message: errors.NOT_FOUND,
      })
    }

    try {
      const emailToken = new EmailToken({
        _userId: user._id,
        token: crypto.randomBytes(16).toString('hex'),
      })
      const token = await emailToken.save()
      await this.sendVerificationEmail(email, token.token)
      res.status(200).send({ email })
    } catch (error) {
      if (error.message === errors.SEND_EMAIL_FAILED) {
        return res.status(401).send({ message: error.message })
      }

      res.status(500).send({ message: errors.INTERNAL_ERROR })
    }
  }
}

export default VerifyController
