const express = require('express')
const router = new express.Router()
const resetController = require('../controllers/reset.controller')

router.post('/password', resetController.resetPassword)
router.post('/password/verify', resetController.resetPasswordVerify)

module.exports = router
