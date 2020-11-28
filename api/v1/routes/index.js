const express = require('express')

// Import All routers
const userRouter = require('./user')

const appRouter = express.Router()

// appRouter.use(/* name of the router  */)
appRouter.use(userRouter)

module.exports = appRouter