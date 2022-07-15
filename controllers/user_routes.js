// require express to build routes
const express = require('express')
// router variable instead of app
const router = express.Router()
// import User model to access database
const User = require('../models/user')
// bcrypt is used to hash/encrypt passwords
const bcrypt = require('bcryptjs')

// NEW user registration form
// GET
router.get('/signup', (req, res) => {
    res.render('user/signup')
})

// CREATE new user
// POST
router.post('/signup', async (req, res) => {
    // console.log('this is our request body', req.body)
    // encrypt password
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    // console.log('this is our request body after hash', req.body)
    // now that the password is hashed, create user
    User.create(req.body)
        // if created successfully, redirect to login page
        .then(user => {
            // console.log('this is the new user', user)
            res.redirect('/user/login')
        })
        // if creation fails, send error
        .catch(err => {
            console.log(err)
            // res.json(err)
        })
})

// SHOW login page
// GET
router.get('/login', (req, res) => {
    res.render('user/login')
})

// CREATE session and log in
// POST
router.post('/login', async (req, res) => {
    // console.log('this is the request object', req)
    // destructure data from request body
    const { username, password } = req.body
    // console.log('this is the username', username)
    // console.log('this is password', password)
    // console.log('this is the session: ', req.session)

    // find user and check if they exist
    User.findOne({ username })
        .then( async (user) => { // there should be a ._id in this return value
            // if they do, compare entered password with stored hash
            if (user) {
                //compare password
                // bcrypt.compare evaluates to truthy or falsey value
                const result = await bcrypt.compare(password, user.password)
                // if passwords match, use newly created session object
                if (result) {
                    // if compare comes back truthy, store user properties in the session
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user._id
                    // console.log('this is the session after login: ', req.session)
                    res.redirect('/parties')
                } else {
                    // if passwords don't match, send error message
                    // send a res.json error message
                    res.json({ error: 'username or password incorrect' })
                }
            } else {
                // send an error if user doesn't exist
                res.json({ error: 'user does not exist' })
            }
        })
        // if username doesn't exist, redirect to signup page
        .catch(err => {
            console.log(err)
            res.json(err)
        })
        .catch(err => {res.redirect('/user/signup')})
})

// one logout route
// GET that calls destroy on current session
router.get('/logout', (req, res) => {
    req.session.destroy(ret => {
        // console.log('this is the logout error: ', ret)
        // console.log('session has been destroyed')
        // console.log(req.session)
        res.redirect('/parties')
    })
})

// fallback route redirect to login page
// GET
// router.get('/*', (req, res) => {
//     res.redirect('user/login')
// })

module.exports = router