import Company from '../models/company.model'
import User from '../models/user.model'
import Location from '../models/location.model'

class LocationsController {
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
    const companyId = req.body.companyId
    const location = new Location(req.body)

    try {
      const user = await User.findOne({ email: req.user.email }).exec()
      location.createdBy = user._id
      const newLocation = await location.save()
      const company = await Company.findByIdAndUpdate(
        companyId,
        { $push: { locations: newLocation._id } },
        { new: true }
      )
        .populate({ path: 'locations', options: { sort: { name: 1 } } })
        .exec()

      res.send(company)
    } catch (error) {
      console.log(error)
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

  public deactivateLocation = async (req, res) => {
    const id = req.params.id
    try {
      const location = await Location.findByIdAndUpdate(
        id,
        { active: false },
        {
          new: true,
        }
      ).exec()

      res.send(location)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  public reactivateLocation = async (req, res) => {
    const id = req.params.id
    try {
      const location = await Location.findByIdAndUpdate(
        id,
        { active: true },
        {
          new: true,
        }
      ).exec()

      res.send(location)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  public reactivateLocationsByCompany = async (req, res) => {
    const companyId = req.params.companyId

    try {
      await Location.updateMany(
        {
          companyId,
          active: false,
        },
        { $set: { active: true } }
      ).exec()

      const company = await Company.findById(companyId)
        .populate({ path: 'locations', options: { sort: { name: 1 } } })
        .exec()

      res.send(company)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default LocationsController
