import crypto from 'crypto'
import PasswordToken from '../models/passwordToken.model'
import User from '../models/user.model'
import EmailUtil from '../utils/email.util'
import { ERRORS } from '../_constants'

class ResetController {
  private sendPasswordResetEmail = new EmailUtil().sendPasswordResetEmail

  public validateToken = async (req, res) => {
    const token = req.params.token

    try {
      const foundToken = await PasswordToken.findOne({ token })

      console.log(foundToken)
      if (!foundToken) {
        return res.status(401).send({
          message: ERRORS.EXPIRED_TOKEN,
        })
      }

      res.sendStatus(204)
    } catch (error) {
      res.status(500).send({ message: ERRORS.INTERNAL_ERROR })
    }
  }

  public resetPassword = async (req, res) => {
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
      await this.sendPasswordResetEmail(email, token.token)
      res.status(200).send({ email })
    } catch (error) {
      if (token) await token.remove()

      if (error.message === ERRORS.SEND_EMAIL_FAILED) {
        return res.status(401).send({ message: error.message })
      }

      res.status(500).send({ message: ERRORS.INTERNAL_ERROR })
    }
  }

  public resetPasswordVerify = async (req, res) => {
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
}

export default ResetController
