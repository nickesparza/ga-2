///////////////////////////
// import dependencies
///////////////////////////
const mongoose = require('./connection')

///////////////////////////
// define user model
///////////////////////////
// pull schema and model constructors from mongoose
// use destructuring syntax
const { Schema, model } = mongoose

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true })

// make user model with use schema
const User = model('User', userSchema)

///////////////////////////
// export user model
///////////////////////////
module.exports = User