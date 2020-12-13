const express = require('express')
const { register, login, getMe } = require('../controllers/auth')

const { protect, authorize } = require('../middleware/auth')

const authRouter = express.Router()

authRouter.route('/auth/register')
    .post(register)

authRouter.route('/auth/login')
    .post(login)

authRouter.route('/auth/me')
    .get(protect, getMe)


module.exports = authRouter