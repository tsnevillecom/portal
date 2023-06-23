import { Router } from 'express'
import UsersController from '../controllers/users.controller'
import AuthMiddleware from '../middleware/auth.middleware'

class UsersRouter {
  public router = Router()
  public usersController = new UsersController()
  public authenticate = new AuthMiddleware().authenticate

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get('/', this.authenticate, this.usersController.getUsers)
    this.router.post('/', this.authenticate, this.usersController.createUser)
    this.router.get('/:id', this.authenticate, this.usersController.getUser)
    this.router.patch(
      '/:id',
      this.authenticate,
      this.usersController.updateUser
    )
    this.router.delete(
      '/:id',
      this.authenticate,
      this.usersController.deleteUser
    )
    this.router.patch(
      '/reinstate/:id',
      this.authenticate,
      this.usersController.reinstateUser
    )
  }
}

export default UsersRouter
