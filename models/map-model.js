const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
*/
const mapSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerName: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        mapType: { type: String, required: true},
        comments: { type: [{
            user: String,
            comment: String,
            likes: {type: Array},
            dislikes: {type: Array},
        }], required: false},
        published: { type: Boolean, required: true },
        publishedDate: {type: Date},
        likes: {type: Array},
        dislikes: {type: Array},
        views: {type: Number, required: false},
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', mapSchema)