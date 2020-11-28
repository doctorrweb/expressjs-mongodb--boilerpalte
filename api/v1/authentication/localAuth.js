
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

const localOptions = { usernameField: 'email' }

const verify = async (email, password, done) => {

    // Find the user given email
    const user = await User.findOne({ 'local.email': email })

    // If not, handle it
    if (!user) return done(null, false)

    // Check if the password is correct

    const isMatch = await bcrypt.compare(password, user.local.password)

    if (!isMatch) return done(null, false)

    return done(null, user)
}

passport.use(new LocalStrategy(localOptions, verify))