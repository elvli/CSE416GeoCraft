const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    mapType: { type: String, required: true },
    comments: {
      type: [{
        user: String,
        comment: String,
        likes: { type: Array },
        dislikes: { type: Array },
        profilePicture: {type: String}
      }], required: false
    },
    published: { type: Boolean, required: true },
    publishedDate: { type: Date },
    likes: { type: Array },
    dislikes: { type: Array },
    views: { type: Number, required: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Map', mapSchema);