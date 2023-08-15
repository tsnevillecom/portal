import { Router } from 'express'
import LocationsController from '../controllers/locations.controller'
import AuthMiddleware from '../middleware/auth.middleware'

class LocationsRouter {
  public router = Router()
  public locationsController = new LocationsController()
  public authenticate = new AuthMiddleware().authenticate

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get(
      '/',
      this.authenticate,
      this.locationsController.getAllLocations
    )
    this.router.post(
      '/',
      this.authenticate,
      this.locationsController.createLocation
    )
    this.router.get(
      '/:id',
      this.authenticate,
      this.locationsController.getLocation
    )
    this.router.patch(
      '/:id',
      this.authenticate,
      this.locationsController.updateLocation
    )
    this.router.delete(
      '/:id',
      this.authenticate,
      this.locationsController.deleteLocation
    )
  }
}

export default LocationsRouter
