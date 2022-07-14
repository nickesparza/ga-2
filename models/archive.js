// require existing mongoose connection to db
const mongoose = require('./connection')
// will require snack schema for subdocuments later on
// TODO: create Snack schema
// const snackSchema = require('./snack')
// TODO: create Movie Schema
// const Movie = require('./movie')

const { Schema, model } = mongoose

const archiveSchema = new Schema({
    name: { type: String, required: true },
    date: String,
    // this will refer to the owner of the party for the purposes of displaying a user's parties
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    watched: { type: Boolean, default: false },
    // I might not need this attribute
    archived: Boolean,
    // movies will be a schema ref
}, { timestamps: true })

const Archive = model('Archive', archiveSchema)

module.exports = Archive