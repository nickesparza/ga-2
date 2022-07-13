///////////////////////////
// import dependencies
///////////////////////////
const mongoose = require('./connection')
const partySchema = require('./party')

///////////////////////////
// define user model
///////////////////////////
// pull schema and model constructors from mongoose
// use destructuring syntax
const { Schema, model } = mongoose

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    parties: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Party'
        }
    ]
}, { timestamps: true })

// make user model with use schema
const User = model('User', userSchema)

///////////////////////////
// export user model
///////////////////////////
module.exports = User