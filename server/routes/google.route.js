const express = require('express')
const router = new express.Router()
const googleController = require('../controllers/google.controller')

router.post('/login', googleController.login)
router.post('/register', googleController.register)

module.exports = router
