// require express to build routes
const express = require('express')
const fetch = require('node-fetch')
// router variable instead of app
const router = express.Router()
// import models to access database
const Party = require('../models/party')
const User = require('../models/user')
const Movie = require('../models/movie')
// const Test = require('../testdata/test')

const key = process.env.API_KEY

// DELETE watch party from database
// DELETE
router.delete('/:id', (req, res) => {
    const partyId = req.params.id
    // before deleting the party, remove references to it from all movies inside
    Movie.find({parties: partyId})
        .then(movies => {
            movies.forEach(movie => {
                if (movie.parties.includes(partyId)) {
                    const partyToDelete = movie.parties.indexOf(partyId)
                    movie.parties.splice(partyToDelete, 1)
                    movie.save()
                }
            })
            console.log(movies)
        })
    Party.findByIdAndRemove(partyId)
        .then(res.redirect('/parties'))
        .catch(err => console.error(err))
})

// NEW watch party form
// GET
router.get('/new', (req, res) => {
    const session = req.session
    res.render('parties/new', {session: session})
})

// CREATE new watch party
// POST
router.post('/new', (req, res) => {
    // get the current user ID from the session
    const userId = req.session.userId
    // add current user to the request body
    req.body.owner = userId
    // console.log(`this is the request body being sent`)
    // console.log(req.body)
    req.body.jsDate = Date.parse(req.body.date)
    Party.create(req.body)
        .then(party => {
            console.log(party)
            // associate the new party with the user who is logged in
            User.findById(userId)
                .then(user => {
                    // add party to the user's array of parties
                    user.parties.push(party)
                    return user.save()
                })
            // redirect to newly created party show page
            res.redirect(`/parties/${party._id}`)
        })
        .catch(err => console.error(err))
})

// EDIT watch party form
// GET
router.get('/:id/edit', (req, res) => {
    const partyId = req.params.id
    const session = req.session
    Party.findById(partyId)
        .then(party => {
            res.render('parties/edit', {party, session})
        })
})

// UPDATE watch party form
// PUT
router.put('/:id/edit', (req, res) => {
    const partyId = req.params.id
    req.body.jsDate = Date.parse(req.body.date)
    const newDetails = req.body
    // console.log(req.body)
    Party.findByIdAndUpdate(partyId, newDetails)
        .then(res.redirect(`/parties/${partyId}`))
})

// NEW search for movies form
// GET
router.get('/:id/search', (req, res) => {
    const partyId = req.params.id
    const session = req.session
    Party.findById(partyId)
        .then(party => {
            // console.log(party)
            res.render('parties/search', { party, id: partyId, session })
        })
})

// return search results
// POST
router.post('/:id/search', async (req, res) => {
    const session = req.session
    const partyId = req.params.id
    const searchTerm = req.body.title
    if (searchTerm) {
        const searchUrl = `https://imdb-api.com/en/API/SearchMovie/${key}/${searchTerm}`
        const response = await fetch(searchUrl)
        const searchResults = await response.json()
        // console.log(searchResults)
        res.render('parties/search', { results: searchResults.results, id: partyId, session, search: searchTerm })
        // Test.find({title: { $regex: searchTerm, $options: "i" }})
        // .then(results => {
        //     // console.log(results)
        //     res.render('parties/search', { results, id: partyId, session, search: searchTerm })
        // })
        // .catch(err => console.error(err))
    } else {
        res.redirect(`/parties/${partyId}/search`)
    }

})

// UPDATE a watch party with a movie
router.put('/:id/:movieId', async (req, res) => {
    const partyId = req.params.id
    const movieId = req.params.movieId
    // console.log(`this is the IMDB id we're fetching: ${movieId}`)
    const searchUrl = `https://imdb-api.com/en/API/Title/${key}/${movieId}`
    const response = await fetch(searchUrl)
    const movieToAdd = await response.json()
    // console.log(movieToAdd.id)
    // TODO: this will create a movie even if it already exists in the db, fix it at some point
    const movieToFind = await Movie.findOne({id: movieToAdd.id})
    // console.log(movieToFind)
    // console.log(`${movieToFind.id}, ${movieToAdd.id}`)
    if (movieToFind !== null && movieToAdd.id === movieToFind.id) {
        // add the existing movie to the watch party instead of creating it
        console.log(`these movies are the same!!!!!`)
        const party = Party.findById(partyId, function (err, party) {
            party.movies.push(movieToFind)
            return party.save()
        })
        Movie.findOne({id: movieToFind.id}, function (err, movie) {
            movie.parties.push(partyId)
            return movie.save()
        })
        res.redirect(`/parties/${partyId}`)
    } else {
        // since the movie doesn't exist, create it and add it to the party
        console.log(`these movies are not the same!!!!!`)
        Movie.create(movieToAdd)
        .then(movie => {
            // console.log(movie)
            Party.findById(partyId)
                .then(party => {
                    party.movies.push(movie)
                    return party.save()
                })
                .then(party => {
                    movie.parties.push(party)
                    return movie.save()
                })
                .then(res.redirect(`/parties/${partyId}`))
                .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    }
    // Movie.create(movieToAdd)
    //     .then(movie => {
    //         // console.log(movie)
    //         Party.findById(partyId)
    //             .then(party => {
    //                 party.movies.push(movie)
    //                 return party.save()
    //             })
    //             .then(party => {
    //                 movie.parties.push(party)
    //                 return movie.save()
    //             })
    //             .then(res.redirect(`/parties/${partyId}`))
    //             .catch(err => console.error(err))
    //     })
    //     .catch(err => console.error(err))
})

// SHOW a single watch party
// GET
router.get('/:id', (req, res) => {
    // get party ID and session ID to populate page
    const partyId = req.params.id
    const session = req.session
    const now = Date.now()
    // find party
    Party.findById(partyId)
        // then, populate movies and snacks inside of party
        .populate('movies')
        .then(party => {
            // console.log(party.jsDate)
            res.render('parties/show', { party, session: session, now })
        })
        .catch(err => console.error(err))
})

// INDEX of all watch parties
// GET
router.get('/', (req, res) => {
    // console.log(req.session)
    const userId = req.session.userId
    // console.log(`this is the userID: ${userId}`)
    const session = req.session
    // get the date for purposes of comparison
    const now = Date.now()
    // if there is an active session, find the user
    if (req.session.username) {
        User.findById(userId)
        .then(user => {
            // then, find all the parties owned by that user
            Party.find({owner: userId, watched: false})
                // then, send all of this data to the index page, including session to display the current username
                .populate('movies')
                .then(parties => {
                    // console.log(parties)
                    res.render('parties/index', {session: session, user, parties, now})
                })
                .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    } else {
        // if there is no active session, show the index
        res.render('parties/index')
    }
})

// fallback route redirect to index
// GET

module.exports = router