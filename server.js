/////////////////////////////////
// import dependencies
/////////////////////////////////
// this allows us to load our env variables
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
// TODO: Add all routes here with the following syntax
// const fruitRoutes = require('./controller/fruit_routes')


////////////////////////////////////////////
// Create express application object
////////////////////////////////////////////
const app = require('liquid-express-views')(express())

////////////////////////////////////////////
// Middleware
////////////////////////////////////////////
// this is for request logging
app.use(morgan('tiny'))
// enables method override in browsers
app.use(methodOverride('_method'))
// parses urlencoded request bodies
app.use(express.urlencoded({ extended: false }))
// to serve files from public statically
app.use(express.static('public'))
// session middleware (express-session and connect-mongo)
const session = require('express-session')
const MongoStore = require('connect-mongo')

// set up session
app.use(
	session({
		secret: process.env.SECRET,
		store: MongoStore.create({
			mongoUrl: process.env.DATABASE_URI
		}),
		saveUninitialized: true,
		resave: false
	})
)

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// require router modules from controllers folder
// TODO: Add routes with this syntax
// app.use('/fruits', fruitRoutes)


app.get('/', (req, res) => {
	// res.send('your server is running')
	res.send(`it's time to watch a movie`)
})

////////////////////////////////////////////
// Server Listener
////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`app is listening on port: ${PORT}`)
})