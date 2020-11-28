const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
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
    console.info('Connected to database !')
})
// Error to connect to databse
db.on('error', (err) => {
    console.error(err)
})

/* ****
end - SETTING OF THE DATABASE
**** */


app.use(morgan('tiny'))

app.use(bodyParser.json({ limit: '50mb' }, { type: '*/*' }))
app.use(bodyParser.urlencoded({ extended: false }, { limit: '50mb' }))

// Middleware for Routes
app.use('/api', appRouter)

app.listen(env.PORT, () => {
    console.info('*********')
    console.info('*********')
    console.info(`The drweb ExpressJS MongoDB Boilerplate server is running on : ${env.BASE_URL}:${env.PORT} !`)
    console.info('*********')
    console.info('*********')
})