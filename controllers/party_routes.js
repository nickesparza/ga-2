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
    // before deleting the party, remove references to it from all the movies inside its movies array
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
    // then, delete the party and go back to the index
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
    // parse the date from the HTML form in a format that javascript can read
    req.body.jsDate = Date.parse(req.body.date)
    Party.create(req.body)
        .then(party => {
            // console.log(party)
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
    console.log(`here is the api key`, key)
    console.log(`here is the movie ID`, searchTerm)
    // double check to make sure a search term has been entered
    if (searchTerm) {
        // perform the fetch request
        const searchUrl = `https://imdb-api.com/en/API/SearchMovie/${key}/${searchTerm}`
        let response
        try {
            response = await fetch(searchUrl)
            if (response.status === "403") {
                console.log(response)
                res.redirect(`/parties/${partyId}/search`)
            }
            // console.log(response)
        } catch (error) {
            console.log(`whoops, got an error`)
            console.log(error)
            res.redirect(`/parties/${partyId}/search`)
        }
        // const response = await fetch(searchUrl)
        const searchResults = await response.json()
        // console.log(searchResults)
        res.render('parties/search', { results: searchResults.results, id: partyId, session, search: searchTerm })
    } else {
        res.redirect(`/parties/${partyId}/search`)
    }

})

// UPDATE a watch party with a movie
router.put('/:id/:movieId', async (req, res) => {
    const partyId = req.params.id
    const movieId = req.params.movieId
    console.log(`here is the api key`, key)
    console.log(`here is the movie ID`, movieId)
    // console.log(`this is the IMDB id we're fetching: ${movieId}`)
    // perform another fetch, this time to get the full movie details
    const searchUrl = `https://imdb-api.com/en/API/Title/${key}/${movieId}`
    let response
    try {
        response = await fetch(searchUrl)
        if (response.status === "403") {
            console.log(response)
            res.redirect(`/parties/${partyId}/search`)
        }
    } catch (error) {
        console.log(error)
        res.redirect(`/parties/${partyId}/search`)
    }
    // const response = await fetch(searchUrl)
    const movieToAdd = await response.json()
    // set this variable to compare and see if this movie already exists in the db
    const movieToFind = await Movie.findOne({id: movieToAdd.id})
    // console.log(`${movieToFind.id}, ${movieToAdd.id}`)
    // if movie to find doesn't return as null, and the movie being added has the same IMDB id, do this
    if (movieToFind !== null && movieToAdd.id === movieToFind.id) {
        // add the existing movie to the watch party instead of creating it
        // console.log(`these movies are the same!!!!!`)
        Party.findById(partyId, function (err, party) {
            console.log(party.movies)
                party.movies.push(movieToFind)
                return party.save()
            // party.movies.push(movieToFind)
            // return party.save()
        })
        Movie.findOne({id: movieToFind.id}, function (err, movie) {
                movie.parties.push(partyId)
                return movie.save()
            // movie.parties.push(partyId)
            // return movie.save()
        })
        res.redirect(`/parties/${partyId}`)
    } else {
        // otherwise, since the movie doesn't exist, create it in the db and add it to the party
        // console.log(`these movies are not the same!!!!!`)
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
})

// SHOW a single watch party
// GET
router.get('/:id', async (req, res) => {
    // get party ID and session ID to populate page
    const partyId = req.params.id
    const session = req.session
    // find party
    if (req.session.username) {
        // console.log('there is a session')
        // console.log(req.session)
        Party.findById(partyId)
            // then, populate movies and snacks inside of party
            .populate('movies')
            .then(party => {
                const now = Date.now()
                // console.log(party.jsDate)
                // console.log(party)
                res.render('parties/show', { party, session: session, now })
            })
            .catch(err => console.error(err))
    } else {
        // console.log('no such party found')
        res.redirect('/parties')
    }
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

module.exports = router