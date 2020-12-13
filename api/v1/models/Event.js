const mongoose = require('mongoose')
const { Schema } = mongoose
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')


const EventSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a content'],
        maxlength: [500, 'description cannot be more than 50 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please add a valid website url with HTTP or HTTPS'
        ]
    },
    email: {
        type: String,
        required: [true, 'Please add an email address'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email address'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    category: {
        type: [String],
        required: [true, 'Please choose a category'],
        enum: [
            'technology',
            'business',
            'other'
        ],
        default: 'other'
    },
    averageRating: {
        type: Number,
        min: [1, 'rating must be at least 1'],
        max: [10, 'Rating cannot be more than 10']
    },
    free: {
        type: Boolean,
        default: true
    },
    averageCost: {
        type: Number,
        required: [
            function () {
                return this.free === false
            },
            'For paid event, averageCost is required'
        ],
    },
    photo: {
        type: String,
        default: 'no-photo-jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Create Event slug from the name
EventSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// Geocode & create location field 
EventSchema.pre('save', async function (next) {
    const loc= await geocoder.geocode(this.address)
    this.location = {
        type: 'Point',
        coor: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    }

    // Do not save address in DB
    this.address = undefined

    next()
})

module.exports = mongoose.model('Event', EventSchema)