///////////////////////////
// import dependencies
///////////////////////////
const mongoose = require('./connection')

const { Schema } = mongoose

// Snack schema as subdocument for Party
const snackSchema = new Schema({
    name: { type: String, required: true },
    purchased: { type: Boolean, default: false }
})

module.exports = snackSchema