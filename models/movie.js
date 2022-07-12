// require existing mongoose connection to db
const mongoose = require('./connection')

const { Schema, model } = mongoose

const movieSchema = new Schema({
    id: String,
    resultType: String,
    image: String,
    title: String,
    description: String
}, { timestamps: true })

const Movie = model('Movie', movieSchema)

module.exports = Movie