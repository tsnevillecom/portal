import { ObjectId } from 'mongodb'
import Company from '../models/company.model'
import User from '../models/user.model'
import Location from '../models/location.model'

class CompaniesController {
  public getAllLocations = async (req, res) => {
    try {
      const locations = await Location.find().exec()
      res.status(200).send(locations)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getLocation = async (req, res) => {
    const id = req.params.id

    try {
      const location = await Location.findOne({ _id: id }).exec()
      res.status(200).send(location)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public createLocation = async (req, res) => {
    const location = new Location(req.body)

    try {
      const user = await User.findOne({ email: req.user.email }).exec()
      location.createdBy = user._id
      await location.save()
      res.send(location)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public updateLocation = async (req, res) => {
    const id = req.params.id

    try {
      const location = await Location.findByIdAndUpdate(id, req.body, {
        new: true,
      }).exec()
      res.send(location)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deleteLocation = async (req, res) => {
    const id = req.params.id
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(404).send()
      }

      const location = await Location.findOne({ _id: id }).exec()
      await location.remove()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default CompaniesController
