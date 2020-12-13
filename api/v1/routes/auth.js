const express = require('express')
const { register, login, getMe } = require('../controllers/auth')

const { protect, authorize } = require('../middleware/auth')

const authRouter = express.Router()

authRouter.route('/register')
    .post(register)

authRouter.route('/login')
    .post(login)

authRouter.route('/me')
    .get(protect, getMe)


module.exports = authRouter