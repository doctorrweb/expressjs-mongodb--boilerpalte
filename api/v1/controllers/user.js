const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

const { clearHash } = require('../utils/cache')

require('dotenv').config()
const env = process.env

/*
@desc       GET all users
@route      GET /api/v1/users
@access     Private/admin
*/
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedFiltering)
})


/*
@desc       GET single user
@route      GET /api/v1/users/:id
@access     Private/admin
*/
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User
        .findById(req.params.id)
        .cache({ key: req.originalUrl })

    res.status(200).json({
        success: true,
        data: user
    })
})


/*
@desc       Create user
@route      POST /api/v1/users/:id
@access     Private/admin
*/
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(200).json({
        success: true,
        data: user
    })

    clearHash(req.originalUrl)
})


/*
@desc       Update user
@route      PUT /api/v1/users/:id
@access     Private/admin
*/
exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })

    clearHash(req.originalUrl)
})


/*
@desc       Delete user
@route      DELETE /api/v1/users/:id
@access     Private/admin
*/
exports.deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if(!user) return next(new ErrorResponse(`No Resource found with the Id of ${req.params.id}`))

    user.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

    clearHash(req.originalUrl)
})

