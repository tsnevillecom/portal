import { ObjectId } from 'mongodb'
import Room from '../models/room'
import User from '../models/user'

class RoomsController {
  public getAllRooms = async (req, res) => {
    try {
      await Room.find({ deleted: false })
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

  public getRoom = async (req, res) => {
    const id = req.params.id

    try {
      const room = await Room.findOne({ _id: id }).populate('createdBy').exec()
      res.status(200).send(room)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public addRoomMembers = async (req, res) => {
    const id = req.params.id
    const members = req.body.members

    try {
      const room = await Room.findOne({ _id: id }).exec()
      room.members = members
      await room.save()
      res.send(room)
      res.status(200).send(room)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public createRoom = async (req, res) => {
    const room = new Room(req.body)

    try {
      const user = await User.findOne({ email: req.user.email })
      room.createdBy = user._id
      room.members = [user._id]
      await room.save()
      res.send(room)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public updateRoom = async (req, res) => {
    const id = req.params.id

    try {
      const room = await Room.findOne({ _id: id })
      room.name = req.body.name
      await room.save()
      res.send(room)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deleteRoom = async (req, res) => {
    const id = req.params.id
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(404).send()
      }

      const room = await Room.findOne({ _id: id })
      await room.remove()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default RoomsController
