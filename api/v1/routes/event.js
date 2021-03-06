const express = require('express')
const {
    createEvent, 
    getEvents, 
    getEvent, 
    updateEvent, 
    deleteEvent, 
    getEventsInRadius,
    fileUploadEvent
} = require('../controllers/event')
const Event = require('../models/Event')

const { protect, authorize } = require('../middleware/auth')
const advancedFiltering = require('../middleware/advancedFiltering')

// Include other resource routers
const postRouter = require('./post')


const eventRouter = express.Router()
// Re-route into other resource routers
eventRouter.use('/:eventId/posts', postRouter)


eventRouter.route('/radius/:zipcode/:distance')
    .get(getEventsInRadius)

eventRouter.route('/:id/photos')
    .put(fileUploadEvent)


eventRouter.route('/')
    .post(protect, createEvent)
    .get(advancedFiltering(Event, { path: 'posts', select: 'title published' }), getEvents) 


eventRouter.route('/:id')
    .get(getEvent)
    .put(protect, updateEvent)
    .delete(protect, deleteEvent)




module.exports = eventRouter