import { ObjectId } from 'mongodb'
import Channel from '../models/channel.model'
import User from '../models/user.model'
import Message from '../models/message.model'

class ChannelsController {
  public getAllChannels = async (req, res) => {
    try {
      const channels = await Channel.find({ active: true }).exec()
      res.status(200).send(channels)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getChannelsByMemberId = async (req, res) => {
    const userId = req.user._id
    try {
      const channels = await Channel.find({
        active: true,
        members: { $in: [userId] },
      }).exec()
      res.status(200).send(channels)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getMessagesByChannelId = async (req, res) => {
    const channelId = req.params.id
    try {
      const messages = await Message.find({
        deleted: false,
        channelId: channelId,
      }).exec()
      res.status(200).send(messages)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getChannel = async (req, res) => {
    const id = req.params.id

    try {
      const channel = await Channel.findOne({ _id: id }).exec()
      res.status(200).send(channel)
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
    console.log(req.user)

    const channel = new Channel(req.body)

    try {
      const user = await User.findOne({ email: req.user.email }).exec()
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
      const channel = await Channel.findOne({ _id: id }).exec()
      channel.name = req.body.name
      await channel.save()
      res.send(channel)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deactivateChannel = async (req, res) => {
    const id = req.params.id
    try {
      const channel = await Channel.findOne({ _id: id, active: true }).exec()
      channel.active = false
      await channel.save()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  public reactivateChannel = async (req, res) => {
    const id = req.params.id
    try {
      const channel = await Channel.findOne({ _id: id, active: false }).exec()
      channel.active = true
      await channel.save()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default ChannelsController
