import crypto from 'crypto'
import EmailToken from '../models/emailToken'
import User from '../models/user'
import EmailUtil from '../utils/email.util'
import { errors } from '../_constants'

class RegisterController {
  private sendVerificationEmail = new EmailUtil().sendVerificationEmail

  public register = async (req, res) => {
    const user = new User(req.body)
    const duplicate = await User.findOne({ email: user.email }).exec()
    if (duplicate) {
      return res.status(409).send({
        message: errors.USER_EXISTS,
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
      await this.sendVerificationEmail(newUser.email, token.token)
      res.status(200).send({ user, token: token.token })
    } catch (error) {
      if (newUser) await newUser.remove()

      if (error.message === errors.SEND_EMAIL_FAILED) {
        return res.status(401).send({ message: error.message })
      }

      res.status(500).send({ message: errors.REGISTRATION_FAILED })
    }
  }

  public resendEmail = async (req, res) => {
    const email = req.body.email
    const token = req.body.token

    try {
      const foundToken = await EmailToken.findOne({ token })

      console.log(foundToken)
      if (!foundToken) {
        return res.status(404).send({
          message: errors.NOT_FOUND,
        })
      }

      const user = await User.findOne({ _id: foundToken._userId, email })
      if (!user) {
        return res.status(404).send({
          message: errors.NOT_FOUND,
        })
      }

      await this.sendVerificationEmail(email, token)
      res.status(200).send({ user })
    } catch (error) {
      if (error.message === errors.SEND_EMAIL_FAILED) {
        return res.status(401).send({ message: error.message })
      }

      res.status(500).send({ message: errors.INTERNAL_ERROR })
    }
  }
}

export default RegisterController
