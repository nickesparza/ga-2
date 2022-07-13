// require express to build routes
const express = require('express')
// router variable instead of app
const router = express.Router()
// import Fruit model to access database
const Party = require('../models/party')
const User = require('../models/user')

// DELETE watch party from database
// DELETE

// NEW watch party form
// GET
router.get('/new', (req, res) => {
    const session = req.session
    res.render('parties/new', {session: session})
})
// CREATE new watch party
// POST
router.post('/new', (req, res) => {
    const userId = req.session.userId
    req.body.owner = userId
    // console.log(`this is the request body being sent`)
    // console.log(req.body)
    Party.create(req.body)
        .then(party => {
            console.log(party)
            User.findById(userId)
                .then(user => {
                    user.parties.push(party)
                    return user.save()
                })
        })
        .then(res.redirect('/parties'))
        .catch(err => res.json(err))
})

// EDIT watch party form
// GET

// UPDATE watch party form
// PUT

// SHOW a single watch party
// GET
router.get('/:id', (req, res) => {
    const partyId = req.params.id
    const session = req.session
    Party.findById(partyId)
        .then(party => {
            res.render('parties/show', { party, session: session })
        })
})

// INDEX of all watch parties
// GET
router.get('/', (req, res) => {
    console.log(req.session)
    const userId = req.session.userId
    console.log(userId)
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