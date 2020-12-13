const express = require('express')
const {
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
} = require('../controllers/post')

const { protect, authorize } = require('../middleware/auth')

const postRouter = express.Router({ mergeParams: true })
 

postRouter.route('/')
    .get(getPosts) 
    .post(addPost)

postRouter.route('/:id')
    .get(getPost)
    .put(updatePost)
    .delete(deletePost)


module.exports = postRouter