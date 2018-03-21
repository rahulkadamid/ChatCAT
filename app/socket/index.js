"use strict"

const helpers = require('../helpers');

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms

	io.of('/roomslist').on('connect', socket => {

    socket.on('getChatrooms', () => {
      socket.emit('chatRoomList', JSON.stringify(allrooms));
    })

		socket.on('createRoom', newRoomInput => {
      // check to see if a room exists otherwise create it and broadcast it
      if(!helpers.findRoomByName(allrooms, newRoomInput)) {
        allrooms.push({
          room: newRoomInput,
          roomID: helpers.randomHex(),
          users: []
        });


        // Emit the list updated to the creator
        socket.emit('chatRoomList', JSON.stringify(allrooms));
        // Emit the list updated to evryone connected to the rooms page ('/roomslist')
        socket.broadcast.emit('chatRoomList', JSON.stringify(allrooms));
      }
    });
  });

  io.of('/chatter').on('connect', socket => {
    // Join chat room
    socket.on('join', data => {
      let userList = helpers.adduserToRoom(allrooms, data, socket);
      if (userList) {
        // emit to all but creator
        socket.broadcast.to(data.roomID).emit('updateUserList', JSON.stringify(userList.users));

        // emit to the creator
        socket.emit('updateUserList', JSON.stringify(userList.users));
      }
    });
    // When the socket logout
    socket.on('disconnect', () => {
      let room = helpers.removeUserFromRoom(allrooms, socket);
      if (room) socket.broadcast.to(room.roomID).emit('updateUserList', JSON.stringify(room.users));
    });

    // When a message is recieve
    socket.on('newMessage', data => {
      socket.to(data.roomID).emit('inMessage', JSON.stringify(data) )
    })
  });
}
