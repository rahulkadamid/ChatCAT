"use strict"

const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

// Iterate over the routes and mount them
let _registerRoute = (routes, method) => {
	for (let key in routes) {
		if( routes[key] && typeof routes[key] === 'object' && !(routes[key] instanceof Array) ){
			_registerRoute(routes[key], key);
		} else{
			// Register routes
			if (method === 'get'){
				router.get(key, routes[key])
			}
			else if (method === 'post') {
				router.get(key, routes[key])
			}
			else if (method === 'NA') {
				router.use(routes[key])
			}
		}
	}
}

let route = (routes) => {
	_registerRoute(routes)
	return router;
}

// Find by id (MongoID)
let findById = id => {
	return new Promise((resolve, reject) => {
		  db.userModel.findById(id, (error, user) => {
		  	if (error) return reject(error);
		  	resolve(user)
		  })
	})
}

// Find a single user based on a key
let findOne = profileId => {
	return db.userModel.findOne({
		'profileId': profileId
	})
}

// Find a room by a given name
let findRoomByName = (allRooms, room) => {
  let findRoom = allRooms.findIndex( (ele) => ele.room === room)
  return findRoom > -1;
}

// Generate a unique id
let randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
}

// Find room by the given id
let findRoomById = (allRooms, roomID) => {
  return allRooms.find( (room) =>room.roomID === roomID );
}

// Create a new user and return that instance
let createNewUser = profile => {
	return new Promise( (resolve, reject) => {
		let newChatUser = new db.userModel({
			profileId: profile.id,
			fullName: profile.displayName,
			profilePic: profile.photos[0].value || '',
		});

		newChatUser.save( error => {
			if ( error ) return reject(error)
			return resolve(newChatUser)

		})
	})
}

// Add user to room
let adduserToRoom = (allRooms, data, socket) => {
  let getRoom = findRoomById(allRooms, data.roomID)
  if (getRoom) {
    // Get the active users
    let userId = socket.request.session.passport.user;
    //Check if the if the users exists on the room
    let checkUser = getRoom.users.findIndex( user =>  user.userID === userId );

    // if exits remove it
    if (checkUser > -1) {
      getRoom.users.splice(checkUser, 1)
    }

    // push user to the room
    getRoom.users.push({
      socketID: socket.id,
      userID: userId,
      user: data.user,
      userPic: data.userPic
    });

    // Join the room channel
    socket.join(data.roomID)

    return getRoom
  }
}

// Remove user from room
let removeUserFromRoom = (allRooms, socket) => {
  for (let room of allRooms) {
    let findUSer = room.users.findIndex( user => user.socketID === socket.id)

    if (findUSer > -1) {
      socket.leave(room.roomID);
      if (room.users) room.users.splice(findUSer, 1);
      return room;
    }
  }
}

// middleware to check if the user is authenticated
let isAuthenticated = (req, res, next) => {
	if( req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = {
	route,
	findOne,
	createNewUser,
	findById,
  isAuthenticated,
  findRoomByName,
  randomHex,
  findRoomById,
  adduserToRoom,
  removeUserFromRoom
}
