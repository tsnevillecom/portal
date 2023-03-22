const express = require('express')
const router = new express.Router()
const registerController = require('../controllers/register.controller')

router.post('/', registerController.register)
router.post('/resend', registerController.resendEmail)

module.exports = router
