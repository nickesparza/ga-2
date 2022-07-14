// require express to build routes
const express = require('express')
// router variable instead of app
const router = express.Router()
// import Fruit model to access database
const Movie = require('../models/movie')
const Party = require('../models/party')

// NEW movie search
// GET

// DELETE movie from a party
// DELETE
router.delete('/:movieId/:partyId', (req, res) => {
    const movieToDelete = req.params.movieId
    const partyToDeleteFrom = req.params.partyId
    Party.findOneAndUpdate({partyToDeleteFrom} , {$pull: {movies: movieToDelete}})
        .then(res.redirect`/parties`)

})

module.exports = router