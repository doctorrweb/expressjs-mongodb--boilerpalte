const mongoose = require('mongoose')
const { Schema } = mongoose

const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    slug: String,
    content: {
        type: String,
        required: [true, 'Please add a content'],
    },
    category: {
        type: [String],
        required: [true, 'Please choose a category'],
        enum: [
            'blog',
            'business',
            'other'
        ],
        default: ['other']
    },
    published: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    event: {
        type: Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
})


module.exports = mongoose.model('Post', PostSchema)