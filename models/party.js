// require existing mongoose connection to db
const mongoose = require('./connection')
// will require snack schema for subdocuments later on
const snackSchema = require('./snack')

const { Schema, model } = mongoose

const partySchema = new Schema({
    name: { type: String, required: true },
    date: String,
    jsDate: Number,
    // this will refer to the owner of the party for the purposes of displaying a user's parties
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // this is the array of movies associated with the party
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    snacks: [snackSchema],
    watched: { type: Boolean, default: false },
}, { timestamps: true })

const Party = model('Party', partySchema)

module.exports = Party