import { ObjectId } from 'mongodb'
import Message from '../models/message.model'

class MessagesController {
  public getMessage = async (req, res) => {
    const id = req.params.id

    try {
      const message = await Message.findOne({ _id: id }).exec()
      res.status(200).send(message)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public createMessage = async (req, res) => {
    const userId = req.user._id
    const message = new Message(req.body)

    try {
      message.createdBy = userId
      await message.save()
      res.send(message)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public updateMessage = async (req, res) => {
    const id = req.params.id

    try {
      const message = await Message.findOne({ _id: id }).exec()
      message.body = req.body.body
      await message.save()
      res.send(message)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deleteMessage = async (req, res) => {
    const id = req.params.id
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(404).send()
      }

      const message = await Message.findOne({ _id: id }).exec()
      await message.remove()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

export default MessagesController
