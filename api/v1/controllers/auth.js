const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/user')

const sendEmail = require('../utils/sendEmail')

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


/*
@desc       Get current logged in user
@route      GET /api/v1/auth/me
@access     Private
*/
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})


/*
@desc       Forgot Password
@route      POST /api/v1/auth/forgotpassword
@access     Public
*/
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })


    if(!user) return next(new ErrorResponse('There is no user with that email', 404))

    const resetPasswordToken = user.getResetPasswordToken()
    console.log('resetPasswordToken', resetPasswordToken)

    await user.save({ validateBeforeSave: false })

    // Create Reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetPasswordToken}`

    // Email Message
    const message = `You are receiving this email because you (or somebody else) has requestd a reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        })

        res.status(200).json({
            success: true,
            data: {
                message: 'email sent'
            }
        })

    } catch (error) {
        console.error(error)
        user.resetPassword = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse('Email could not be sent', 500))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})


/*
@desc       Reset Password
@route      PUT /api/v1/auth/resetpassword/:resettoken
@access     Public
*/
exports.resetPassword = asyncHandler(async (req, res, next) => {

    // get hashed token
    const resetPassword = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex')

    const user = await User.findOne({
        resetPassword,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) return next(new ErrorResponse('Invalid Token', 404))

    // Set new password
    user.password = req.body.password
    user.resetPassword = undefined
    user.resetPasswordExpire = undefined
    await user.save()

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