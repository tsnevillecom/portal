import { Router } from 'express'
import RoomsController from '../controllers/rooms.controller'
import AuthMiddleware from '../middleware/auth.middleware'

class RoomsRouter {
  public router = Router()
  public roomsController = new RoomsController()
  public authenticate = new AuthMiddleware().authenticate

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get('/', this.authenticate, this.roomsController.getAllRooms)
    this.router.get('/:id', this.authenticate, this.roomsController.getRoom)
    this.router.post('/', this.authenticate, this.roomsController.createRoom)
    this.router.patch(
      '/:id',
      this.authenticate,
      this.roomsController.updateRoom
    )
    this.router.delete(
      '/:id',
      this.authenticate,
      this.roomsController.deleteRoom
    )

    //Room Members
    this.router.post(
      '/:id/members',
      this.authenticate,
      this.roomsController.addRoomMembers
    )
  }
}

export default RoomsRouter
