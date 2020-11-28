const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema } = mongoose

const UserSchema = new Schema({
    method: {
        type: String,
        enum: ['local', /* facebook, google, linkedin, github, activDirecvtory */]
    },
    local: {
        email: {
            type: String
        },
        password: {
            type: String
        }
    },
    surname: {
        type: String
    },
    firstname: {
        type: String
    },
    role: {
        type: String,
        lowercase: true,
        enum: [
            'suscriber',
            'manager',
            'administrator'
        ],
        required: true,
        default: 'suscriber'
    },
    pic: {
        type: String
    }
})

const User = mongoose.model('user', UserSchema)


module.exports = User