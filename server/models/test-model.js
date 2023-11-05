/* @author Elven Li */

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const testSchema = new Schema(
    {
        testString: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('TestSchema', testSchema)