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
        color: String,
      }], required: false
    },
    choroData: {
      type: {
        regionData: [{
          id: Number,
          region: String,
          data: Number,
        }],
        choroSettings: {
          theme: String,
          headerValue: String
        }
      },
      required: false
    },
    heatmap: { type: Schema.Types.Mixed, required: false },
    mapID: { type: Object, required: true },
    settings: {
      type: {
        longitude: String,
        latitude: String,
        zoom: String
      }, required: true
    }
  },
  { timestamps: true },
)

module.exports = mongoose.model('MapData', mapDataSchema)