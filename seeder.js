const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')

require('dotenv').config()
const env = process.env

// Load Models
const Event = require('./api/v1/models/Event')
const Post = require('./api/v1/models/Post')


// Connect to DB
mongoose.connect(
    env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
)

// Read the JSON Files
const events = JSON.parse(fs.readFileSync(`${__dirname}/_data/events.json`, 'utf-8'))

// Read the JSON Files
const posts = JSON.parse(fs.readFileSync(`${__dirname}/_data/posts.json`, 'utf-8'))

// Import into DB
const importData = async () => {
    try {
        await Event.create(events)
        await Post.create(posts)
        console.log('Data imported ...'.green.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

// Delete Data
const deleteData = async () => {
    try {
        await Event.deleteMany()
        await Post.deleteMany()
        console.log('Data destroyed ...'.red.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i') return importData()
if (process.argv[2] === '-d') return deleteData()
