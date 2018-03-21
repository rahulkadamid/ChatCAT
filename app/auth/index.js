"use strict"

const passport = require('passport');
const config = require('../config');
const logger = require('../logger');
const helpers = require('../helpers');
const fbStrategy = require('passport-facebook').Strategy;
const twStrategy = require('passport-twitter').Strategy;

module.exports = () => {
	// Storing the session with the unique id of mongoDB
	passport.serializeUser((user, done) => {
		done(null, user.id)
	});

	// Find the user using the id
	passport.deserializeUser((id, done) => {
		helpers.findById(id)
			.then( user => done(null, user))
			.catch( err => done(err));
	})

	let authProcessor = (accessToken, refreshToken, profile, done) => {
		// Find a use in the local db using profile.id
		// if use found, return the user data using the done()
		// if not user found, create one and return it using done()
		helpers.findOne(profile.id)
			.then( result => {
				if (result) {
					done(null, result)
				} else{
					helpers.createNewUser(profile)
					.then( newUser => done(null, newUser))
					.catch( err => logger.log('error', 'Cannot Create a new User: ' + err));
				}
			})
	}

	// Login with FB
	passport.use( new fbStrategy({
			clientID: config.FB.APP_ID,
			clientSecret: config.FB.APP_SECRET,
			callbackURL: config.FB.CALLBACK_URL,
			profileFields: config.FB.PROFILE_FIELDS
		},
		authProcessor)
	);

	// Login with twitter
	passport.use( new twStrategy({
			consumerKey: config.TW.API_KEY,
			consumerSecret: config.TW.API_SECRET,
			callbackURL: config.TW.CALLBACK_URL,
			profileFields: config.TW.PROFILE_FIELDS
		},
		authProcessor)
	);
}
