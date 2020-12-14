const path = require('path')
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
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create Query String
    let queryStr = JSON.stringify(reqQuery)

    // Create operators ($gt, $gte, $lt, $lte and $in)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Finding Resource
    query = Event.find(JSON.parse(queryStr)).populate({
        path: 'posts',
        select: 'title published'
    })

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        console.log('fields', fields)
        query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 50
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const totalDoc = await Event.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Pagination Result
    const pagination = {}

    if (endIndex < totalDoc) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // Executing query
    const events = await query
    res.status(200).json({
        success: true,
        count: events.length,
        pagination,
        data: events
    })
})


/*
@desc       Get single event
@route      GET /api/v1/events/:id
@access     Public
*/
exports.getEvent = asyncHandler( async (req, res, next) => {
    const event = await Event.findById(req.params.id).populate({
        path: 'posts',
        select: 'title published'
    })

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
    
    const event = await Event.findById(req.params.id)

    if(!event) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    event.remove()

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
    const radius = 3963.2 / distance

    const events = await Event.find({
        location: { $geoWithin: { $centerSphere: [ [lng, lat], radius ] } }
    }).populate({
        path: 'posts',
        select: 'title published'
    })

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    })
})


/*
@desc       Upload Photo event
@route      PUT /api/v1/events/:id/photo
@access     Private
*/
exports.fileUploadEvent = asyncHandler( async (req, res, next) => {
    
    const event = await Event.findById(req.params.id)
    const file = req.files.file

    if(!event) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    if(!req.files) return next(new ErrorResponse('Please upload a file', 400))

    if(!file.mimetype.startsWith('image')) return next(new ErrorResponse('Please upload an image', 400))

    if(!file.size > env.MAX_UPLOAD_FILE) return next(new ErrorResponse(`Please upload an image less than ${env.MAX_UPLOAD_FILE}`, 400))

    // Create custom file name
    file.name = `photo_${event._id}${path.parse(file.name).ext}`

    file.mv(`${env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err)
            return next(new ErrorResponse('Problem with file upload', 500))
        }
    })

    await Event.findByIdAndUpdate(req.params.id, { photo: file.name })

    res.status(200).json({
        success: true,
        data: { file: file.name }
    })
 
})