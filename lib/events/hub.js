'use strict';

/** 3rd party dependencies */
require('dotenv').config();
const io = require('socket.io')(3000); // <-- Connected to whichever server is hosting events

/** Primary game namespace */
const gameRoom = io.of('/gameroom');

/** Built-in method of socket.io engine to overwrite default socket ID and create a custom ID for all connected sockets */
let custom_id = 0;
io.engine.generateId = (req) => {
  return "custom:id:" + custom_id++;
};

io.on('connect', (socket) => {
  console.log(`Connected to socket ${socket.id}`);
  socket.on('fromPlayer1', () => {
    console.log('recieved from player 1');
    setTimeout(() => {
      socket.emit('toPlayer1')
    }, 1000);
  });
  socket.on('fromPlayer2', () => {
    console.log('recieved from player 2');
    setTimeout(() => {
      socket.emit('toPlayer2')
    }, 1000);
  });
  socket.on('fromPlayer3', () => {
    console.log('recieved from player 3');
    setTimeout(() => {
      socket.emit('toPlayer3')
    }, 1000);
  });
  socket.on('fromPlayer4', () => {
    console.log('recieved from player 4');
    setTimeout(() => {
      socket.emit('toPlayer4');
    }, 1000);
  });
});


 




