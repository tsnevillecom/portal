import { Router } from 'express'
import AuthMiddleware from '../middleware/auth.middleware'
import MessagesController from '../controllers/messages.controller'

class MessagesRouter {
  public router = Router()
  public messagesController = new MessagesController()
  public authenticate = new AuthMiddleware().authenticate

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.post(
      '/',
      this.authenticate,
      this.messagesController.createMessage
    )
    this.router.get(
      '/:id',
      this.authenticate,
      this.messagesController.getMessage
    )
    this.router.patch(
      '/:id',
      this.authenticate,
      this.messagesController.updateMessage
    )
    this.router.delete(
      '/:id',
      this.authenticate,
      this.messagesController.deleteMessage
    )
  }
}

export default MessagesRouter
