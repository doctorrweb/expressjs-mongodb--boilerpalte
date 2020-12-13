const express = require('express')
const morgan = require('morgan')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./api/v1/middleware/error')
// const mongoose = require('mongoose')

require('dotenv').config()
const env = process.env

const database = require('./database')
const appRouter = require('./api/v1/routes')

const app = express()

/* ****
start - SETTING OF THE DATABASE
**** */

database.connect()


// Test to connection to database
const db = database.connection
db.once('open', () => {
    console.info('Connected to database !'.cyan.underline.bold)
})
// Error to connect to databse
db.on('error', (err) => {
    console.error(err)
})

/* ****
end - SETTING OF THE DATABASE
**** */


app.use(morgan('tiny'))

app.use(express.json({ limit: '50mb' }, { type: '*/*' }))
app.use(express.urlencoded({ extended: false }, { limit: '50mb' }))

app.use(cookieParser())

// Middleware for Routes
app.use('/api/v1', appRouter)


// Custom Error Handler
app.use(errorHandler)

const server = app.listen(env.PORT, () => {
    console.info('*********')
    console.info('*********')
    console.info(`The drweb ExpressJS MongoDB Boilerplate server is running on : ${env.BASE_URL}:${env.PORT} !`.yellow.bold)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)

    // Close server & exit process
    server.close(() => {
        database.close()
        process.exit(1)
    })
})