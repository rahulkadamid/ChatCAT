"use strict"

const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

// Social Authentication Logic loaded
require('./auth')();

// Create an IO server Instance
let ioServer = app => {
	app.locals.chatrooms = [];
	const server = require('http').Server(app);
  const io = require('socket.io')(server);

  // Force socket.io to only use WebSockets
  io.set('transports', ['websocket']);
  // Create the clients for redis, in prod we'll use auth.
  let pubClient = redis(config.REDIS.PORT, config.REDIS.HOST, {
    auth_pass: config.REDIS.PASSWORD
  });
  let subClient = redis(config.REDIS.PORT, config.REDIS.HOST, {
    return_buffers: true,
    auth_pass: config.REDIS.PASSWORD
  });
  // Create the adapter to redis using the library and passing the pub and the sub clients
  io.adapter(adapter({
    pubClient,
    subClient
  }));

	io.use((socket, next) => {
		require('./session')(socket.request, {}, next)
	})
	require('./socket')(io, app)
	return server;
}

module.exports = {
	router: require('./routes/routes')(),
	session: require('./session'),
  ioServer,
  logger: require('./logger')
}
