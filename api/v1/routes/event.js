const { Router } = require('express')
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

const { protect, authorize } = require('../middleware/auth')

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
    .post(createEvent)
    .get(getEvents) 


eventRouter.route('/:id')
    .get(getEvent)
    .put(updateEvent)
    .delete(deleteEvent)




module.exports = eventRouter