import { ObjectId } from 'mongodb'
import Company from '../models/company.model'
import User from '../models/user.model'
import Location from '../models/location.model'
import { log } from 'console'

class CompaniesController {
  public getAllCompanies = async (req, res) => {
    try {
      const companys = await Company.find().sort({ name: 1 }).exec()
      res.status(200).send(companys)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getUsersByCompanyId = async (req, res) => {
    const companyId = req.params.id
    try {
      const users = await User.find({
        active: true,
        companyId: companyId,
      }).exec()
      res.status(200).send(users)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getLocationsByCompanyId = async (req, res) => {
    const companyId = req.params.id

    try {
      const locations = await Location.find({
        companyId: companyId,
      }).exec()
      res.status(200).send(locations)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getCompany = async (req, res) => {
    const id = req.params.id

    try {
      const company = await Company.findOne({ _id: id })
        .populate({ path: 'locations', options: { sort: { name: 1 } } })
        .exec()
      res.status(200).send(company)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public createCompany = async (req, res) => {
    const company = new Company(req.body)

    try {
      const user = await User.findOne({ email: req.user.email }).exec()
      company.createdBy = user._id
      await company.save()
      res.send(company)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public updateCompany = async (req, res) => {
    const id = req.params.id

    try {
      const company = await Company.findByIdAndUpdate(id, req.body, {
        new: true,
      })
        .populate({ path: 'locations', options: { sort: { name: 1 } } })
        .exec()
      res.send(company)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deactivateCompany = async (req, res) => {
    const id = req.params.id
    try {
      await Location.updateMany(
        { companyId: id },
        { $set: { active: false } },
        { multi: true }
      )

      const company = await Company.findByIdAndUpdate(
        id,
        { active: false },
        {
          new: true,
        }
      )
        .populate({ path: 'locations', options: { sort: { name: 1 } } })
        .exec()

      res.send(company)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  public reactivateCompany = async (req, res) => {
    const id = req.params.id

    try {
      const company = await Company.findByIdAndUpdate(
        id,
        { active: true },
        {
          new: true,
        }
      )
        .populate({ path: 'locations', options: { sort: { name: 1 } } })
        .exec()

      res.send(company)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default CompaniesController
