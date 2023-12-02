const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapDataSchema = new Schema(
  {
    GeoJson: { type: Schema.Types.Mixed, required: false },
    points: {
      type: [{
        longitude: Number,
        latitude: Number,
      }], required: false
    },
    mapID: { type: Object, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('MapData', mapDataSchema)