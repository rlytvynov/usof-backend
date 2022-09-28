const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/register', authController.register)
router.get('/activation/:activationToken', authController.confirmEmail)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/password-reset', authController.forgetPassword)
router.post('/password-reset/:confirm_token', authController.resetPassword)

module.exports = router