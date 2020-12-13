const express = require('express')
const userController = require('../controllers/user')
const authorize = require('../authorization/index')
require('../authentication/jwtAuth')
require('../authentication/localAuth')
const passport = require('passport')

const jwtAuthentication = passport.authenticate('jwt', { session: false })
const localAuthentication = passport.authenticate('local', { session: false })

const userRouter = express.Router()
userRouter.route('/signup')
    .post(userController.signUp)

userRouter.route('/signin')  
    .post(localAuthentication, userController.signIn)
    
userRouter.route('/')
    .get(jwtAuthentication, userController.readAll)

userRouter.route('/:id')
    .get(jwtAuthentication, userController.readOne)
    .put(jwtAuthentication, authorize('administrator'), userController.update)
    .delete(jwtAuthentication, authorize('administrator'), userController.delete)

userRouter.route('/updatepassword/:id')
    .put(jwtAuthentication, authorize('administrator'), userController.updatePassword)    

module.exports = userRouter 