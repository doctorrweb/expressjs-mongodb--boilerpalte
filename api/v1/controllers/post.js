const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Post = require('../models/Post')

require('dotenv').config()
const env = process.env


/*
@desc       Create a new post
@route      POST /api/v1/posts
@access     Public
*/
exports.createPost = asyncHandler( async (req, res, next) => {
    const post = await Post.create(req.body)
    res.status(200).json({
        success: true,
        data: post
    })
})


/*
@desc       Get all posts
@route      GET /api/v1/posts
@access     Public
*/
exports.getPosts = asyncHandler(async (req, res, next) => {
    let query

    if (req.params.eventId) {
        query = Post.find({ event: req.params.eventId })
    } else {
        query = Post.find().populate({
            path: 'event',
            select: 'name description'
        })
    }

    const posts = await query

    res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
    })
})