import { Router } from 'express'
import VerifyController from '../controllers/verify.controller'

class VerifyRouter {
  public router = Router()
  public verifyController = new VerifyController()

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get('/:token', this.verifyController.verifyToken)
    this.router.post('/email', this.verifyController.verifyEmail)
  }
}

export default VerifyRouter
