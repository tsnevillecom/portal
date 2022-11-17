const express = require('express')
const router = new express.Router()
const registerController = require('../controllers/register.controller')

router.post('/', registerController.register)

module.exports = router
