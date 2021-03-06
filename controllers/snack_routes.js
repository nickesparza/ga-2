// require express to build routes
const express = require('express')
// router variable instead of app
const router = express.Router()
// import Party model
const Party = require('../models/party')

// CREATE new snack
router.post('/:partyId', (req, res) => {
    const partyId = req.params.partyId
    Party.findById(partyId)
        .then(party => {
            const newSnack = req.body
            newSnack.purchased = newSnack.purchased === 'on'
            // console.log(newSnack)
            party.snacks.push(newSnack)
            // console.log(party)
            return party.save()
        })
        .then(res.redirect(`/parties/${partyId}`))
        .catch(err => console.log(err))
})

// EDIT snack
router.put('/:partyId/:snackId', (req, res) => {
    const { partyId, snackId } = req.params
    // console.log(`This is the party ID that got passed in: ${partyId}`)
    // console.log(`This is the snack ID that got passed in: ${snackId}`)
    Party.findById(partyId)
        .then(party => {
            // find the subdoc with the correct snack ID
            const snackToUpdate = party.snacks.id(snackId)
            // console.log(`This is the snack we're trying to update: ${snackToUpdate}`)
            // could probably do this more elegantly but, it's the toggle for setting a snack as in stock
            if (snackToUpdate.purchased) {
                snackToUpdate.purchased = false
            } else {
                snackToUpdate.purchased = true
            }
            // console.log(`this is the current state of the purchased field: ${snackToUpdate.purchased}`)
            return party.save()
        })
        .then(res.redirect(`/parties/${partyId}`))
        .catch(err => console.log(err))
})

// DELETE snack
router.delete('/:partyId/:snackId', (req, res) => {
    const { partyId, snackId } = req.params
    Party.findById(partyId)
        .then(party => {
            // find the snack to delete
            const snackToDelete = party.snacks.id(snackId)
            // remove it and save the party
            snackToDelete.remove()
            return party.save()
        })
        .then(res.redirect(`/parties/${partyId}`))
        .catch(err => {console.log(err)})
})

module.exports = router