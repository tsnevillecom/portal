import { ObjectId } from 'mongodb'
import Company from '../models/company.model'
import User from '../models/user.model'
import Location from '../models/location.model'
import { log } from 'console'

class CompaniesController {
  public getAllCompanies = async (req, res) => {
    try {
      const companys = await Company.find().exec()
      res.status(200).send(companys)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getUsersByCompanyId = async (req, res) => {
    const companyId = req.params.id
    try {
      const users = await User.find({
        deleted: false,
        companyId: companyId,
      }).exec()
      res.status(200).send(users)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public getLocationsByCompanyId = async (req, res) => {
    const companyId = req.params.id

    console.log(companyId)

    try {
      const locations = await Location.find({
        deleted: false,
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
      const company = await Company.findOne({ _id: id }).exec()
      res.status(200).send(company)
    } catch (error) {
      res.status(404).send({ message: error.message })
    }
  }

  public createCompany = async (req, res) => {
    console.log(req.user)
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
      const company = await Company.findOne({ _id: id }).exec()
      company.name = req.body.name
      await company.save()
      res.send(company)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deleteCompany = async (req, res) => {
    const id = req.params.id
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(404).send()
      }

      const company = await Company.findOne({ _id: id }).exec()
      await company.remove()
      res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default CompaniesController
