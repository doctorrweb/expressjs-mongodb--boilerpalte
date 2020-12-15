const express = require('express')
const {
    register, 
    login, 
    getMe,
    forgotPassword,
    resetPassword
} = require('../controllers/auth')

const { protect, authorize } = require('../middleware/auth')

const authRouter = express.Router()

authRouter.route('/register')
    .post(register)

authRouter.route('/login')
    .post(login)

authRouter.route('/me') 
    .get(protect, getMe)

authRouter.route('/forgotpassword')
    .post(forgotPassword)

authRouter.route('/resetpassword/:resetToken')
    .put(resetPassword)




module.exports = authRouter