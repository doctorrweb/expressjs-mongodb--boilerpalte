const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const env = process.env

const { Schema } = mongoose

const UserSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'facebook' /* facebook, google, linkedin, github, activDirecvtory */],
        required: [true, 'Please select a connection Method']
    },
    email: {
        type: String,
        required: [true, 'Please add an email address'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email address'
        ],
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return this.method === 'local'
        },
        minlength: [8, 'Your password must have 8 characters minimum'],
        select: false,
    },
    resetPassword: String,
    resetPasswordExpire: Date,
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


// Encrypt Password
UserSchema.pre('save', async function (next) {
    console.log('Password', this.password)
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Compare Password
UserSchema.methods.matchPassword = async function (password) {
    return bcrypt.compareSync(password, this.password)
}

//Sign a web Token
UserSchema.methods.getSignedJwtToken = () => {
    return jwt.sign(
        { id: this._id }, 
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRE }
    )
} 

const User = mongoose.model('User', UserSchema)


module.exports = User