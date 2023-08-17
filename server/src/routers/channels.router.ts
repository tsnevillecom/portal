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
    this.router.post(
      '/',
      this.authenticate,
      this.channelsController.createChannel
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
    this.router.get(
      '/:id/messages',
      this.authenticate,
      this.channelsController.getMessagesByChannelId
    )
    this.router.patch(
      '/:id',
      this.authenticate,
      this.channelsController.updateChannel
    )
    this.router.post(
      '/deactivate/:id',
      this.authenticate,
      this.channelsController.deactivateChannel
    )
    this.router.post(
      '/reactivate/:id',
      this.authenticate,
      this.channelsController.reactivateChannel
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
