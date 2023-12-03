const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapDataSchema = new Schema(
  {
    GeoJson: { type: Schema.Types.Mixed, required: false },
    points: {
      type: [{
        id: Number,
        longitude: String,
        latitude: String,
      }], required: false
    },
    mapID: { type: Object, required: true },
    settings: { type: {
      longitude: String,
      latitude: String,
      zoom: String
    }, required: true}
  },
  { timestamps: true },
)

module.exports = mongoose.model('MapData', mapDataSchema)