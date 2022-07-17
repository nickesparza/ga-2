// require express to build routes
const express = require('express')
const fetch = require('node-fetch')
// router variable instead of app
const router = express.Router()
// import Party and User models to access database
const Party = require('../models/party')
const User = require('../models/user')

const key = process.env.API_KEY

// CREATE archive route
// router.post('/:partyId', (req, res) => {
//     const partyId = req.params.partyId
//     Party.findById(partyId)
//         .then(party => {
//             console.log(party)
//             Archive.create(party)
//                 .then(archive => {
//                     console.log(`THIS IS THE ARCHIVE: ${archive}`)
//                 })
//                 .catch(err => console.log(err))
//         })
//         .catch(err => console.log(err))
// })

// mark a party as archived/watched
router.put('/:partyId', (req, res) => {
    const partyId = req.params.partyId
    Party.findByIdAndUpdate(partyId, {watched: true})
        .then(res.redirect(`/parties`))
        .catch(err => console.log(err))
})

// unmark a party as archived
router.put('/:partyId/unarchive', (req, res) => {
    const partyId = req.params.partyId
    Party.findByIdAndUpdate(partyId, {watched: false})
    .then(res.redirect(`/archives`))
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
                Party.find({owner: userId, watched: true})
                    // then, send all of this data to the index page, including session to display the current username
                    .populate('movies')
                    .then(archives => {
                        console.log(archives)
                        res.render('archives/index', {session: session, user, archives})
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        } else {
            // if there is no active session, show the index
            res.redirect('parties/')
        }
    })

// SHOW one archive
router.get('/:id', (req, res) => {
    // get party ID and session ID to populate page
    const partyId = req.params.id
    const session = req.session
    // find party
    Party.findById(partyId)
        // then, populate movies and snacks inside of party
        .populate('movies')
        .then(party => {
            console.log(party)
            res.render('archives/show', { party, session: session })
        })
        .catch(err => console.log(err))
})

// fallback route redirect to index
// GET

module.exports = router