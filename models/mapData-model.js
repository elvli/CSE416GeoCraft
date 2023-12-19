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
    propPoints: {
      type: [{
        id: Number,
        longitude: String,
        latitude: String,
        color: String,
        size: String,
      }], required: false
    },
    lineData: {
      type: [{
        id: Number,
        startlongitude: String,
        startlatitude: String,
        endlongitude: String,
        endlatitude: String,
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
          propName: String,
          theme: String,
          stepCount: String,
          headerValue: String,
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
    },
    legend: {
      type: [{
        color: String,
        description: String,
      }], required: false
    },
    legendTitle: { type: String, required: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('MapData', mapDataSchema);