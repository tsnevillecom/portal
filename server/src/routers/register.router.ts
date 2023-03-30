import { Router } from 'express'
import RegisterController from '../controllers/register.controller'

class RegisterRouter {
  public router = Router()
  public registerController = new RegisterController()

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.post('/', this.registerController.register)
    this.router.post('/resend', this.registerController.resendEmail)
  }
}

export default RegisterRouter
