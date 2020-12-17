const express = require('express')
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user')
const User = require('../models/User')

const advancedFiltering = require('../middleware/advancedFiltering')

const { protect, authorize } = require('../middleware/auth')

const userRouter = express.Router()

 userRouter.use(protect)
 userRouter.use(authorize('administrator'))

userRouter.route('/')
    .get(advancedFiltering(User), getUsers) 
    .post(createUser)

userRouter.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = userRouter