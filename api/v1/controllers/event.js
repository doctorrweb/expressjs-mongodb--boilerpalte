const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Event = require('../models/Event')

const geocoder = require('../utils/geocoder')

require('dotenv').config()
const env = process.env

/*
@desc       Create a new event
@route      POST /api/v1/events
@access     Public
*/

exports.createEvent = asyncHandler( async (req, res, next) => {
    const event = await Event.create(req.body)
    res.status(200).json({
        success: true,
        data: event
    })
})



/*
@desc       Get all events
@route      GET /api/v1/events
@access     Public
*/

exports.getEvents = asyncHandler( async (req, res, next) => {
    const events = await Event.find({})
    res.status(200).json({
        success: true,
        data: events
    })
})


/*
@desc       Get single events
@route      GET /api/v1/events/:id
@access     Public
*/

exports.getEvent = asyncHandler( async (req, res, next) => {
    const event = await Event.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: event
    })
})


/*
@desc       Update event
@route      PUT /api/v1/events/:id
@access     Public
*/

exports.updateEvent = asyncHandler( async (req, res, next) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: event
    })
})


/*
@desc       Delete event
@route      DELETE /api/v1/events/:id
@access     Public
*/

exports.deleteEvent = asyncHandler( async (req, res, next) => {
    
    const event = await Event.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        data: {}
    })
})


/*
@desc       Get events within a radius
@route      GET /api/v1/events/radius/:zipcode/:distance
@access     Private
*/

exports.getEventsInRadius = asyncHandler( async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    console.log('loc', loc)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calcul radisu using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi || 6,378 km
    const radius = distance / 3963.2

    const events = await Event.find({
        location: { $geoWithin: { $centerSphere: [ [lng, lat], radius ] } }
    })

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    })
})