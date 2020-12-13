const express = require('express')
const {
    createPost,
    getPosts,
} = require('../controllers/post')

const { protect, authorize } = require('../middleware/auth')

const postRouter = express.Router({ mergeParams: true })


postRouter.route('/')
    .post(createPost)
    .get(getPosts) 


module.exports = postRouter