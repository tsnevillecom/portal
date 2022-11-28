const express = require('express')
const router = new express.Router()
const authenticate = require('../middleware/auth')
const teamController = require('../controllers/teams.controller')

router.get('/', authenticate, teamController.getAllTeams)
router.get('/:id', authenticate, teamController.getTeam)
router.post('/', authenticate, teamController.createTeam)
router.patch('/:id', authenticate, teamController.updateTeam)
router.delete('/:id', authenticate, teamController.deleteTeam)

//Team Members
router.post('/:id/members', authenticate, teamController.addTeamMembers)

module.exports = router
