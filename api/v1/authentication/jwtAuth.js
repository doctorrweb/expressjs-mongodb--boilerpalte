const passport = require('passport')
const User = require('../models/User')
const { ExtractJwt, Strategy } = require('passport-jwt')
require('dotenv').config()
const JWTStrategy = Strategy

const verify = async (payload, done) => {
    try {
    // Find the user specified in token
        const user = await User.findById(payload.sub)

        // If usrer doesn't exist, handle it
        if (!user) return done(null, false)

        // Otherwise, return user
        done(null, user)
        
    } catch (error) {
        done(error, false)
    }
}

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            secretOrKey: process.env.SECRET
        },
        verify
    )
)