import { Router } from 'express'
import ResetController from '../controllers/reset.controller'

class ResetRouter {
  public router = Router()
  public resetController = new ResetController()

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.post('/password', this.resetController.resetPassword)
    this.router.post(
      '/password/verify',
      this.resetController.resetPasswordVerify
    )
    this.router.get('/password/:token', this.resetController.validateToken)
  }
}

export default ResetRouter
