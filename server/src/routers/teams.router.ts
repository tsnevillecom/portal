import { Router } from 'express'
import TeamsController from '../controllers/teams.controller'
import AuthMiddleware from '../middleware/auth.middleware'

class TeamsRouter {
  public router = Router()
  public teamsController = new TeamsController()
  public authenticate = new AuthMiddleware().authenticate

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get('/', this.authenticate, this.teamsController.getAllTeams)
    this.router.get('/:id', this.authenticate, this.teamsController.getTeam)
    this.router.post('/', this.authenticate, this.teamsController.createTeam)
    this.router.patch(
      '/:id',
      this.authenticate,
      this.teamsController.updateTeam
    )
    this.router.delete(
      '/:id',
      this.authenticate,
      this.teamsController.deleteTeam
    )

    //Team Members
    this.router.post(
      '/:id/members',
      this.authenticate,
      this.teamsController.addTeamMembers
    )
  }
}

export default TeamsRouter
