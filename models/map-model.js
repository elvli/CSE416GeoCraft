const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
*/
const mapSchema = new Schema(
    {
        name: { type: String, required: false },
        ownerName: { type: String, required: false },
        ownerEmail: { type: String, required: false },
        data: { type: [{}], required: false },
        comments: { type: [{
            user: String,
            comment: String,
            likes: {type: Array, required: false},
            dislikes: {type: Array, required: false},
        }], required: false},
        published: { type: Boolean, required: false },
        publishedDate: {type: Date},
        likes: {type: Array, required: false},
        dislikes: {type: Array, required: false},
        views: {type: Number, required: false},
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', mapSchema)