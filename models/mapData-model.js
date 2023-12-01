const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
*/
const mapDataSchema = new Schema(
    {
        GeoJson: { type: mixed, required: false},
        data: { type: [{
            longitude: Number, 
            latitude: Number,
            required: false
        }]}
    },
    { timestamps: true },
)

module.exports = mongoose.model('MapData', mapDataSchema)