const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const authController = require('../controllers/authController')

const checkAuth = (req, res, next) => {
    const token = req.headers.authorization

    if (token) {
        try {
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.user = user
            next()
        } catch (error) {
            next()
        }
    } else {
        return res.status(403).json({
            msg: 'No access'
        })
    }
}

router.post('/register', authController.register)
router.post('/activation/:activationToken', authController.confirmEmail)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/me', checkAuth, authController.me)
router.post('/password-reset', authController.forgetPassword)
router.post('/password-reset/:confirm_token', authController.resetPassword)

module.exports = router