"use stric"

const express = require('express');
const passport = require('passport');
const app = express();

// This normaly will look into the app folder for an index.js file
const chatCat = require('./app');

// Set the renderer
app.set('view engine', 'ejs');

// Setup session configuration
app.use(chatCat.session)

// Initialize passport middlewares
app.use(passport.initialize());
app.use(passport.session())

// Set Morgan middleware
app.use(require('morgan')('combined', {
  stream: {
    write: message => {
      // Write to logs
      chatCat.logger.log('info', message);
    }
  }
}))

// Set up the router
app.use('/', chatCat.router)

// assets middleware
app.use(express.static('public'))

// Listen to the port
chatCat.ioServer(app).listen(process.env.PORT || 3000, () => {
	console.log("ChatCAT Running on port 3000");
})
