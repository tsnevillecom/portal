import { Router } from 'express'
import AuthController from '../controllers/auth.controller'
import AuthMiddleware from '../middleware/auth.middleware'

class AuthRouter {
  public router = Router()
  private authController = new AuthController()
  private authenticate = new AuthMiddleware().authenticate

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get('/me', this.authenticate, this.authController.me)
    this.router.get(
      '/checkSession',
      this.authenticate,
      this.authController.checkSession
    )
    this.router.get('/refresh', this.authController.refresh)
    this.router.post('/logout', this.authController.logout)
    this.router.post(
      '/logoutall',
      this.authenticate,
      this.authController.logoutAll
    )
    this.router.post('/', this.authController.login)
  }
}

export default AuthRouter
