const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Post = require('../models/Post')
const Event = require('../models/Event')

const { clearHash } = require('../utils/cache')

require('dotenv').config()
const env = process.env


/*
@desc       Create a new post
@route      POST /api/v1/posts
@access     Public
*/
exports.createPost = asyncHandler( async (req, res, next) => {
    req.body.user = req.user.id
    
    const post = await Post.create(req.body)
    res.status(200).json({
        success: true,
        data: post
    })

    clearHash(req.originalUrl)
})


/*
@desc       Get all posts
@route      GET /api/v1/posts
@access     Public
*/
exports.getPosts = asyncHandler(async (req, res, next) => {
    if (req.params.eventId) {
        const posts = Post
            .find({ event: req.params.eventId })
            .cache({ key: req.originalUrl })
    } else {
        res.status(200).json(res.advancedFiltering)
    }
})


/*
@desc       Get single post
@route      GET /api/v1/posts/:id
@access     Public
*/
exports.getPost = asyncHandler( async (req, res, next) => {

    const post = await Post
        .findById(req.params.id)
        .populate({
            path: 'event',
            select: 'name description'
        })
        .cache({ key: req.originalUrl })

    if(!post) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    res.status(200).json({
        success: true,
        data: post
    })
})


/*
@desc       Add a post
@route      Post /api/v1/events/:eventId/posts
@access     Private
*/
exports.addPost = asyncHandler( async (req, res, next) => {

    req.body.event = req.params.eventId
    req.body.user = req.user.id

    const event = await Event.findById(req.params.eventId)

    if(!event) return next(new ErrorResponse(`Resource not found with id of ${req.params.eventId}`, 404))

    // Make sure User is the event owner
    if(event.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to update this content`, 401))
    }

    const post = await Post.create(req.body)

    res.status(200).json({
        success: true,
        data: post
    })

    clearHash('/api/v1/posts')
})


/*
@desc       Update a post
@route      PUT /api/v1/posts/:id
@access     Private
*/
exports.updatePost = asyncHandler( async (req, res, next) => {

    let post = await Post.findById(req.params.id)

    if(!post) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(post.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to update this content`, 401))
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: post
    })

    clearHash(req.originalUrl)
})


/*
@desc       Delete a post
@route      DELETE /api/v1/posts/:id
@access     Private
*/
exports.deletePost = asyncHandler( async (req, res, next) => {

    const post = await Post.findById(req.params.id)

    if(!post) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(post.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to delete this content`, 401))
    }

    await post.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

    clearHash(req.originalUrl)
})