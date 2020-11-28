const lodash = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')
const User = require('../models/user')
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
                if (existingUser) return res.status(422).json({ error: 'this email already exists' })
                if (lodash.isEmpty(email) || lodash.isEmpty(password)) {
                    console.log('email', email)
                    return res
                        .status(422)
                        .json({ error: 'email or password field is empty' })
                } else {
                    bcrypt.genSalt(13, (err, salt) => {
                        //const newUser = new User(req.body)
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
                            return res.status(201).json(newUser)
                        })
                    })
                }
            })
        } catch (error) {
            return res.status(400).json({ message: 'Bad Request' })
        }
    },
    /*
    
    */
    signIn: async (req, res) => {
        try {
            res.status(200).json({ token: getToken(req.user) })
        } catch (error) {
            res.status(400).json({ message: 'Bad Request' })
        }
    },
    readAll: async (req, res) => {
        try {
            const users = await User.find({})
            res.status(200).json(users)
        } catch (error) {
            res.status(400).json({ message: 'Bad Request' })
        }
    },
    readOne: async (req, res) => {
        try {
            const { id } = req.params
            const user = await User.findById(id)
            res.status(200).json(user)
        } catch (error) {
            res.status(400).json({ message: 'Bad Request' })
        }
    },
    update: async (req, res) => {
        try {
            // Enforce that req.body must contain all the fields
            const { id } = req.params
            await User.findByIdAndUpdate(
                id,
                req.body,
                { new: true },
                (err, updatedUser) => {
                    err ? res.status(500).send(err) : res.status(200).send(updatedUser)
                }
            )
        } catch (error) {
            res.status(400).json({ message: 'Bad Request' })
        }
    },
    updatePassword: async (req, res) => {
        try {
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
                                        err ? res.status(500).send(err) : res.status(200).send(updatedUser)
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
        } catch (error) {
            res.status(400).json({ message: 'Bad Request' })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            await User.findByIdAndDelete(id, err => {
                err ? res.status(500).send(err) : res.status(200).json({ success: true })
            })
        } catch (error) {
            res.status(400).json({ message: 'Bad Request' })
        }
    }
}

module.exports = userController