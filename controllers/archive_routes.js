// require express to build routes
const express = require('express')
const fetch = require('node-fetch')
// router variable instead of app
const router = express.Router()
// import Fruit model to access database
const Party = require('../models/party')
const Movie = require('../models/movie')
const User = require('../models/user')
const Archive = require('../models/archive')

const key = process.env.API_KEY

// CREATE archive route
router.post('/:partyId', (req, res) => {
    const partyId = req.params.partyId
    Party.findById(partyId)
        .then(party => {
            console.log(party)
            Archive.create(party)
                .then(archive => {
                    console.log(`THIS IS THE ARCHIVE: ${archive}`)
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

// INDEX all archived
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
                Archive.find({owner: userId})
                    // then, send all of this data to the index page, including session to display the current username
                    .then(archives => {
                        res.render('archives/index', {session: session, user, archives})
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        } else {
            // if there is no active session, show the index
            res.render('parties/index')
        }
    })
// SHOW one archive

// fallback route redirect to index
// GET

module.exports = router