// require express to build routes
const express = require('express')
// router variable instead of app
const router = express.Router()
// import movie and Party models to access database
const Movie = require('../models/movie')
const Party = require('../models/party')

// DELETE movie from a party
// DELETE
router.delete('/:movieId/:partyId/:index', async (req, res) => {
    const movieToDelete = req.params.movieId
    const partyToDeleteFrom = req.params.partyId
    const indexOfMovie = req.params.index
    // console.log(`THIS IS THE MOVIE TO TRY TO UNLINK FROM THE PARTY: ${movieToDelete}`)
    // console.log(`THIS IS THE PARTY TO TRY TO DELETE THIS MOVIE INSIDE OF: ${partyToDeleteFrom}`)
    Party.findById(partyToDeleteFrom, function (err, party) {
        party.movies.splice(indexOfMovie, 1)
        if (!party.movies.includes(movieToDelete)) {
            Movie.findByIdAndUpdate(movieToDelete, {$pull: {parties: partyToDeleteFrom}})
                .catch(err => console.log(err))
        }
        return party.save()
    })
    res.redirect(`/parties/${partyToDeleteFrom}`)
    // Party.findByIdAndUpdate(partyToDeleteFrom, {$pull: {movies: movieToDelete}})
    //     .then(party => console.log(`THIS IS WHAT THE ${party.name} MOVIES ARRAY LOOKS LIKE: ${party.movies}`))
    //     .catch(err => console.log(err))
    // Movie.findByIdAndUpdate(movieToDelete, {$pull: {parties: partyToDeleteFrom}})
    //     .then(movie => {
    //         // console.log(`THIS IS WHAT THE ${movie.title} PARTIES ARRAY LOOKS LIKE: ${movie.parties}`)
    //         res.redirect(`/parties/${partyToDeleteFrom}`)
    //     })
    //     .catch(err => console.log(err))
})

module.exports = router