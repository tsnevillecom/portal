import { Router } from 'express'
import ChannelsController from '../controllers/channels.controller'
import AuthMiddleware from '../middleware/auth.middleware'

class ChannelsRouter {
  public router = Router()
  public channelsController = new ChannelsController()
  public authenticate = new AuthMiddleware().authenticate

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get(
      '/',
      this.authenticate,
      this.channelsController.getAllChannels
    )
    this.router.get(
      '/member',
      this.authenticate,
      this.channelsController.getChannelsByMemberId
    )
    this.router.get(
      '/:id',
      this.authenticate,
      this.channelsController.getChannel
    )
    this.router.post(
      '/',
      this.authenticate,
      this.channelsController.createChannel
    )
    this.router.patch(
      '/:id',
      this.authenticate,
      this.channelsController.updateChannel
    )
    this.router.delete(
      '/:id',
      this.authenticate,
      this.channelsController.deleteChannel
    )

    //Channel Members
    this.router.post(
      '/:id/members',
      this.authenticate,
      this.channelsController.addChannelMembers
    )
  }
}

export default ChannelsRouter
