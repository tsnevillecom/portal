const express = require('express')
const router = new express.Router()
const verifyController = require('../controllers/verify.controller')

router.get('/:token', verifyController.verifyToken)
router.post('/email', verifyController.verifyEmail)

module.exports = router
