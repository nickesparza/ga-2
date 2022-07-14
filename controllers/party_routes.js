// require express to build routes
const express = require('express')
const fetch = require('node-fetch')
// router variable instead of app
const router = express.Router()
// import Fruit model to access database
const Party = require('../models/party')
const User = require('../models/user')
const Movie = require('../models/movie')
const Test = require('../testdata/test')

const key = process.env.API_KEY

// DELETE watch party from database
// DELETE
router.delete('/:id', (req, res) => {
    const partyId = req.params.id
    Party.findByIdAndRemove(partyId)
        .then(res.redirect('/parties'))
        .catch(err => res.json(err))
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
        .catch(err => res.json(err))
})

// EDIT watch party form
// GET

// UPDATE watch party form
// PUT

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
// THIS WILL NEED TO CHANGE TO A FETCH REQUEST TO IMDB
// TODO: change to fetch request
router.post('/:id/search', (req, res) => {
    const session = req.session
    const partyId = req.params.id
    const searchTerm = req.body.title
    if (searchTerm) {
        Test.find({title: { $regex: searchTerm, $options: "i" }})
        .then(results => {
            // console.log(results)
            res.render('parties/search', { results, id: partyId, session, search: searchTerm })
        })
        .catch(err => res.json(err))
    } else {
        res.redirect(`/parties/${partyId}/search`)
    }

})

// UPDATE a watch party with a movie
router.put('/:id/:movieId', async (req, res) => {
    const partyId = req.params.id
    const movieId = req.params.movieId
    console.log(`this is the IMDB id we're fetching: ${movieId}`)
    const searchUrl = `https://imdb-api.com/en/API/Title/${key}/${movieId}`
    const response = await fetch(searchUrl)
    const movieToAdd = await response.json()
    console.log(movieToAdd.id)
    // TODO: this will create a movie even if it already exists in the db, fix it at some point
    Movie.create(movieToAdd)
        .then(movie => {
            console.log(movie)
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
        .catch(err => res.json(err))
})

// SHOW a single watch party
// GET
router.get('/:id', (req, res) => {
    // get party ID and session ID to populate page
    const partyId = req.params.id
    const session = req.session
    // find party
    Party.findById(partyId)
        .populate('movies')
        .then(party => {
            console.log(party)
            // then, find the movies inside of party
            res.render('parties/show', { party, session: session })
            // Movie.find({parties: partyId})
            //     .then(movies => {
            //         console.log(`HERE ARE THE MOVIES INSIDE OF ${party.name}: ${movies}`)
            //         console.log(party)
            //         res.render('parties/show', { party, movies, session: session })
            //     })
        })
        .catch(err => console.log(err))
})

// INDEX of all watch parties
// GET
router.get('/', (req, res) => {
    console.log(req.session)
    const userId = req.session.userId
    console.log(`this is the userID: ${userId}`)
    const session = req.session
    // if there is an active session, find the user
    if (req.session.username) {
        User.findById(userId)
        .then(user => {
            // then, find all the parties owned by that user
            Party.find({owner: userId})
                // then, send all of this data to the index page, including session to display the current username
                .then(parties => {
                    res.render('parties/index', {session: session, user, parties})
                })
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
    } else {
        // if there is no active session, show the index
        res.render('parties/index')
    }
})

// fallback route redirect to index
// GET

module.exports = router