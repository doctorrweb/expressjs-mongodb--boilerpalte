const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/user')

require('dotenv').config()
const env = process.env

/*
@desc       Register user
@route      POST /api/v1/auth/register
@access     Public
*/

exports.register = asyncHandler(async (req, res, next) => {
    const { method, name, firstname, email, password, role  } = req.body
    
    // Create user
    const user = await User.create({
        method,
        name,
        firstname,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)

})


/*
@desc       Register user
@route      POST /api/v1/auth/register
@access     Public
*/

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password  } = req.body
    
    // validate email & Password
    if(!email || !password) return next(new ErrorResponse('Please provide an email and password', 400))
    
    // Check for user
    const user = await User.findOne({ email }).select('+password')
    if(!user) return next(new ErrorResponse('Invalid credentials', 401))

    // Check if password is correct
    const isMatch = await user.matchPassword(password)
    console.log('isMatch', isMatch)
    if(!isMatch) return next(new ErrorResponse('Invalid credentials', 401))

    sendTokenResponse(user, 200, res)

})


// get Token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create Token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}