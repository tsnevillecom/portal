import { Router } from 'express'
import AuthMiddleware from '../middleware/auth.middleware'
import CompaniesController from '../controllers/companies.controller'

class CompaniessRouter {
  public router = Router()
  public companiesContoller = new CompaniesController()
  public authenticate = new AuthMiddleware().authenticate

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get(
      '/',
      this.authenticate,
      this.companiesContoller.getAllCompanies
    )
    this.router.post(
      '/',
      this.authenticate,
      this.companiesContoller.createCompany
    )
    this.router.get(
      '/:id/users',
      this.authenticate,
      this.companiesContoller.getUsersByCompanyId
    )
    this.router.get(
      '/:id/locations',
      this.authenticate,
      this.companiesContoller.getLocationsByCompanyId
    )
    this.router.get(
      '/:id',
      this.authenticate,
      this.companiesContoller.getCompany
    )
    this.router.patch(
      '/:id',
      this.authenticate,
      this.companiesContoller.updateCompany
    )
    this.router.patch(
      '/deactivate/:id',
      this.authenticate,
      this.companiesContoller.deactivateCompany
    )
    this.router.patch(
      '/reactivate/:id',
      this.authenticate,
      this.companiesContoller.reactivateCompany
    )
  }
}

export default CompaniessRouter
