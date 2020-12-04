const lodash = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')
const User = require('../models/user')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

require('dotenv').config()

const getToken = user => {

    const addDays = (dateObj, numDays) => {
        const copy = new Date(Number(dateObj))
        copy.setDate(date.getDate() + numDays)
        return copy.getTime()
    }
    
    const date = new Date()
    const expirationDate = addDays(date, 10)
    const timeStamp = date.getTime()


    return jwt.encode(
        {
            sub: user.id,
            surname: user.surname,
            firstname: user.firstname,
            iat: timeStamp,
            exp: expirationDate,
            role: user.role
        },
        process.env.SECRET
    )
}

const userController = {
    signUp: async (req, res, next) => {
        const { email, password, surname, firstname, role } = req.body
        try {
            await User.findOne({ 'local.email': email }, (err, existingUser) => {
                if (err) return next(err)
                if (existingUser) return next(new ErrorResponse('this email already exists', 422))
                if (lodash.isEmpty(email) || lodash.isEmpty(password)) {
                    return next(new ErrorResponse('email or password field is empty', 422))
                } else {
                    bcrypt.genSalt(13, (err, salt) => {

                        const newUser = new User({
                            method: 'local',
                            local: {
                                email,
                                password
                            },
                            surname,
                            firstname,
                            role
                        })
                        bcrypt.hash(password, salt, function (err, hash) {
                            // Store hash in your password DB.
                            newUser.local.password = hash
                            newUser.save()
                            return res.status(201).json({ success: true, data: newUser })
                        })
                    })
                }
            })
        } catch (error) {
            next(error)
        }
    },
    /*
    
    */
    signIn: async (req, res, next) => {
        try {
            res.status(200).json({ success: true, token: getToken(req.user) })
        } catch (error) {
            next(error)
        }
    },
    readAll: asyncHandler(async (req, res, next) => {
        const users = await User.find({})
        res.status(200).json({success: true, data: users})
    }) ,
    readOne: asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.params.id)
        res.status(200).json({success: true, user})
    }),
    update: asyncHandler(async (req, res, next) => {
        // Enforce that req.body must contain all the fields
        const { id } = req.params
        await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true },
            (err, updatedUser) => {
                err ? res.status(500).json({ success: false, message: 'an error occured while updating the user' }) : res.status(200).json({success: true, data: updatedUser})
            }
        )
    }),
    updatePassword: asyncHandler(async (req, res, next) => {
        // Enforce that req.body must contain all the fields
        const { id } = req.params

        if (req.body.newPassword) {
            const { oldPassword, newPassword } = req.body
            //let user = await User.find({ _id: id })
            let user = await User.findById(id)
            if (user) {
                const isValidPassword = await bcrypt.compare(oldPassword, user.local.password)
                await bcrypt.genSalt(13, async (err, salt) => {
                    await bcrypt.hash(newPassword, salt, function (err, hash) {
                        // Store hash in your password DB.
                        if (isValidPassword) {
                            User.findByIdAndUpdate(
                                id,
                                {
                                    local: {
                                        password: hash
                                    }
                                },
                                { new: true },
                                (err, updatedUser) => {
                                    err ? res.status(500).json(err) : res.status(200).send(updatedUser)
                                }
                            )
                        } else {
                            return res.status(404).send('Passwords don\'t match')
                        }
                    })
                })
            } else {
                return res.status(404).send('No user found')
            }
        }
    }),
    delete: asyncHandler(async (req, res, next) => {
        const { id } = req.params
        await User.findByIdAndDelete(id, err => {
            err ? res.status(500).send(err) : res.status(200).json({ success: true, data: {} })
        })
    })
}

module.exports = userController