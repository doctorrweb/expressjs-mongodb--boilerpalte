const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema } = mongoose

const UserSchema = new Schema({
    method: {
        type: String,
        enum: ['local', /* facebook, google, linkedin, github, activDirecvtory */],
        required: true
    },
    local: {
        email: {
            type: String,
            unique: true,
            match: [
                /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please add a Password'],
            minlength: 6,
            select: false
        },
        resePasswordToken: String,
        resetPasswordExpire: Date,
        createdAt: {
            type: Date,
            default: Date.now
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