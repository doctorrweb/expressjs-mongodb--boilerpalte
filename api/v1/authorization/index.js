const jwt = require('jwt-simple')
require('dotenv').config()
// const { secret } = require('../config')

// middleware for doing role-based permissions
function authorize(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1
    // return a middleware
    return (req, res, next) => {
        const token = req.headers.authorization
        const user = jwt.decode(token, process.env.SECRET)

        if (isAllowed(user.role)) next()
        // role is allowed, so continue on the next middleware
        else res.status(403).json({ message: 'Forbidden' }) // user is forbidden
    }
}

module.exports = authorize