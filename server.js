const path = require('path')

const express = require('express')
const morgan = require('morgan')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')
const errorHandler = require('./api/v1/middleware/error')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require("express-rate-limit")
const hpp = require('hpp')
// const cors = require('cors')

require('./api/v1/utils/cache')

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

if (env.NODE_ENV === 'development') {
    app.use(morgan('tiny'))
}

// Handle File Upload
app.use(fileupload())



// To replace prohibited characters with _, use:
// app.use(mongoSanitize({
//   replaceWith: '_'
// }))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }, { limit: '50mb' }))
app.use(express.json({ limit: '50mb' }, { type: '*/*' }))

app.use(cookieParser())

// To remove data, use:
app.use(mongoSanitize())

// To remove data, use:
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Enable CORS
// app.use(cors())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per wind owMs
})

app.use(limiter)

// Prevent http param pollution
app.use(hpp())

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