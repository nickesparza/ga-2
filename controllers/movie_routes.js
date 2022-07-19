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
    // get the ID of the movie, the party, and the index position of the movie, in case it's inside the party more than once
    const movieToDelete = req.params.movieId
    const partyToDeleteFrom = req.params.partyId
    const indexOfMovie = req.params.index
    // console.log(`THIS IS THE MOVIE TO TRY TO UNLINK FROM THE PARTY: ${movieToDelete}`)
    // console.log(`THIS IS THE PARTY TO TRY TO DELETE THIS MOVIE INSIDE OF: ${partyToDeleteFrom}`)
    // find the party and remove the movie at the set index position
    Party.findById(partyToDeleteFrom, function (err, party) {
        party.movies.splice(indexOfMovie, 1)
        // if that party no longer includes that movie inside it (there were no dupes), remove the party's link to that movie entirely
        if (!party.movies.includes(movieToDelete)) {
            Movie.findByIdAndUpdate(movieToDelete, {$pull: {parties: partyToDeleteFrom}})
                .catch(err => console.log(err))
        }
        return party.save()
    })
    res.redirect(`/parties/${partyToDeleteFrom}`)
})

module.exports = router