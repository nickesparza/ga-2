// require existing mongoose connection to db
const mongoose = require('./connection')

const { Schema, model } = mongoose

const movieSchema = new Schema({
    // save only the relevant fields from the IMDB API
    id: String,
    resultType: String,
    image: String,
    title: String,
    plot: String,
    runtimeStr: String,
    parties: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Party'
        }
    ]
}, { timestamps: true })

const Movie = model('Movie', movieSchema)

module.exports = Movie