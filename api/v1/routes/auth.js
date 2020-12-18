const express = require('express')
const {
    register, 
    login, 
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth')

const { protect, authorize } = require('../middleware/auth')

const authRouter = express.Router()

authRouter.route('/register')
    .post(register)

authRouter.route('/login')
    .post(login)

authRouter.route('/logout')
    .get(logout)

authRouter.route('/me') 
    .get(protect, getMe)

authRouter.route('/updatedetails') 
    .put(protect, updateDetails)

authRouter.route('/forgotpassword')
    .post(forgotPassword)

authRouter.route('/updatepassword')
    .put(protect, updatePassword)

authRouter.route('/resetpassword/:resettoken')
    .put(resetPassword)




module.exports = authRouter