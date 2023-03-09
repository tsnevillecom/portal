const express = require('express')
const router = new express.Router()
const authenticate = require('../middleware/auth')
const authController = require('../controllers/auth.controller')

router.get('/me', authenticate, authController.me)
router.get('/checkToken', authenticate, authController.checkToken)
router.get('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.post('/logoutall', authController.logoutAll)
router.post('/reset-password', authController.resetPassword)
router.post('/', authController.login)

module.exports = router
