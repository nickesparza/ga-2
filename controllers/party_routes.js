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

// INDEX of all watch parties
// GET
router.get('/', (req, res) => {
    console.log(req.session)
    const userId = req.session.userId
    console.log(userId)
    const session = req.session
    if (req.session.username) {
        User.findById(userId)
        .then(user => {
            Party.find({owner: userId})
                .then(parties => {
                    res.render('parties/index', {session: session, user, parties})
                })
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
    } else {
        res.redirect('/parties')
    }
})
// SHOW a single watch party
// GET

// fallback route redirect to index
// GET

module.exports = router