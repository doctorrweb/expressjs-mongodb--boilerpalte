const express = require('express')

// Import All routers
const userRouter = require('./user')
const authRouter = require('./auth')

const appRouter = express.Router()

// appRouter.use(/* name of the router  */)
appRouter.use(userRouter)
appRouter.use(authRouter)

module.exports = appRouter