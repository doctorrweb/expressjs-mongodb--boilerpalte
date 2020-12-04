const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const env = process.env

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

/*
UserSchema.pre('save', async (next) => {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


UserSchema.methods.getSignedJwtToken = () => {
    jwt.sign({ id: this._id }, 
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRE })
} 

UserSchema.methods.matchPassword = async (password) => {
    return await bcrypt.compare(password, this.local.password)
}
*/

module.exports = User