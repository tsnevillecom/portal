import { ObjectId } from 'mongodb'
import Channel from '../models/channel'
import User from '../models/user'

class ChannelsController {
  public getAllChannels = async (req, res) => {
    try {
      await Channel.find({ deleted: false })
        .populate([
          { path: 'members', select: 'firstName -_id' },
          { path: 'createdBy', select: '-_id' },
        ])
        .exec(function (error, rooms) {
          if (error) {
            res.status(500).send({ message: error.message })
          }
          res.status(200).send(rooms)
        })
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getChannel = async (req, res) => {
    const id = req.params.id

    try {
      const room = await Channel.findOne({ _id: id })
        .populate('createdBy')
        .exec()
      res.status(200).send(room)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public addChannelMembers = async (req, res) => {
    const id = req.params.id
    const members = req.body.members

    try {
      const channel = await Channel.findOne({ _id: id }).exec()
      channel.members = members
      await channel.save()
      res.send(channel)
      res.status(200).send(channel)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public createChannel = async (req, res) => {
    const channel = new Channel(req.body)

    try {
      const user = await User.findOne({ email: req.user.email })
      channel.createdBy = user._id
      channel.members = [user._id]
      await channel.save()
      res.send(channel)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public updateChannel = async (req, res) => {
    const id = req.params.id

    try {
      const channel = await Channel.findOne({ _id: id })
      channel.name = req.body.name
      await channel.save()
      res.send(channel)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deleteChannel = async (req, res) => {
    const id = req.params.id
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(404).send()
      }

      const channel = await Channel.findOne({ _id: id })
      await channel.remove()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default ChannelsController
