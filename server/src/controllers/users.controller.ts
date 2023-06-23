import Channel from '../models/channel'
import User from '../models/user'
import crypto from 'crypto'
import { errors } from '../_constants'
import EmailToken from '../models/emailToken'
import EmailUtil from '../utils/email.util'

class UsersController {
  private sendVerificationEmail = new EmailUtil().sendVerificationEmail

  public getUsers = async (req, res) => {
    try {
      const users = await User.find({ deleted: false }).exec()
      res.status(200).send(users)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getUser = async (req, res) => {
    const id = req.params.id

    try {
      const user = await User.findOne({ _id: id }).exec()
      res.status(200).send(user)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public createUser = async (req, res) => {
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
      res.send(user)
    } catch (error) {
      if (newUser) await newUser.remove()

      if (error.message === errors.SEND_EMAIL_FAILED) {
        return res.status(401).send({ message: error.message })
      }

      res.status(500).send(error)
    }
  }

  public updateUser = async (req, res) => {
    const id = req.params.id

    try {
      let user = await User.findOne({ _id: id }).exec()
      console.log(req.body)

      await user.save()
      res.send(user)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deleteUser = async (req, res) => {
    const id = req.params.id
    try {
      const user = await User.findOne({ _id: id }).exec()
      user.deleted = true
      await user.save()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  public reinstateUser = async (req, res) => {
    const id = req.params.id
    try {
      const user = await Channel.findOne({ _id: id, deleted: true }).exec()
      user.deleted = false
      await user.save()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default UsersController
