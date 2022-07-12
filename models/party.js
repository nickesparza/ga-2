// require existing mongoose connection to db
const mongoose = require('./connection')
// will require snack schema for subdocuments later on
// TODO: create Snack schema
// const snackSchema = require('./snack')
// TODO: create Movie Schema
// const Movie = require('./movie')

const { Schema, model } = mongoose

const partySchema = new Schema({
    name: { type: String, required: true },
    date: String,
    // this will refer to the owner of the party for the purposes of displaying a user's parties
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    watched: { type: Boolean, default: false },
    // I might not need this attribute
    archived: Boolean,
    // movies will be a schema ref
    // TODO: create and link movie schema
    // movies: [movieSchema]???
}, { timestamps: true })

const Party = model('Party', partySchema)

module.exports = Party