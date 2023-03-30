import { Router } from 'express'
import GoogleController from '../controllers/google.controller'

class GoogleRouter {
  public router = Router()
  public googleController = new GoogleController()

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.post('/login', this.googleController.login)
    this.router.post('/register', this.googleController.register)
  }
}

export default GoogleRouter
