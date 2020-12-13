const express = require('express')
const {
    createEvent, 
    getEvents, 
    getEvent, 
    updateEvent, 
    deleteEvent, 
    getEventsInRadius
} = require('../controllers/event')

const { protect, authorize } = require('../middleware/auth')

const eventRouter = express.Router()


eventRouter.route('/events/radius/:zipcode/:distance')
    .get(getEventsInRadius)


eventRouter.route('/events')
    .post(createEvent)
    .get(getEvents) 


eventRouter.route('/events/:id')
    .get(getEvent)
    .put(updateEvent)
    .delete(deleteEvent)




module.exports = eventRouter