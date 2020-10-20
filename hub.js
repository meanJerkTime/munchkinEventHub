'use strict';

/** 3rd party dependencies */
require('dotenv').config();
const io = require('socket.io')(3000); // <-- Connected to whichever server is hosting events

/** Primary game namespace */
const gameRoom = io.of('/gameroom');

/** Built-in method of socket.io engine to overwrite default socket ID and create a custom ID for all connected sockets */
let custom_id = 0;
io.engine.generateId = (req) => {
  return "User:" + custom_id + Math.floor(Math.random() * 10000);
};

io.on('connect', (socket) => {
  
  socket.on('fromClient', () => {
    console.log(socket.id, 'Connected');
      socket.emit('toClient');
  });
  socket.on('answers', (payload) => {
    // console.log(payload.roomsList);
  });

  // on create room also joins the room
  socket.on('createRoom', function(room) {
    socket.join(room);
    console.log(socket.id, 'joined Room', room);
  });
  // joins the room
  socket.on('joinRoom', function(room) {
    socket.join(room);
    // console.log(socket.id, 'joined Room', room);
  });
  console.log(socket.adapter.rooms);
});
 




