const express = require('express')
const { register, login } = require('../controllers/auth')

const authRouter = express.Router()

authRouter.route('/auth/register')
    .post(register)

authRouter.route('/auth/login')
    .post(login)


module.exports = authRouter