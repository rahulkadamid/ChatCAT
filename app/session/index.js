"use stric"
const config = require('../config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const db = require('../db');

if ( process.env.NODE_ENV === 'production'){
	// Iniitialize session config for production
	module.exports = session({
		secret: config.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: db.Mongoose.connection
		})
	})
} else {
	// Iniitialize session config for dev
	module.exports = session({
		secret: config.SESSION_SECRET,
		resave: false,
		saveUninitialized: true
	})
}