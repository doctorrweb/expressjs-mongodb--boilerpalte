const express = require('express')

// Import All routers
const userRouter = require('./user')
const authRouter = require('./auth')
const eventRouter = require('./event')

const appRouter = express.Router()

// appRouter.use(/* name of the router  */)
appRouter.use(userRouter)
appRouter.use(authRouter)
appRouter.use(eventRouter)

module.exports = appRouter