const express = require('express')

// Import All routers
const userRouter = require('./user')
const authRouter = require('./auth')
const eventRouter = require('./event')
const postRouter = require('./post')

const appRouter = express.Router()

// appRouter.use(/* name of the router  */)
appRouter.use('/users', userRouter)
appRouter.use('/auth', authRouter)
appRouter.use('/events', eventRouter)
appRouter.use('/posts', postRouter)

module.exports = appRouter