'use strict';

/** 3rd party dependencies */
require('dotenv').config({path: require('find-config')('.env')});
const io = require('socket.io-client');
const host = process.env.HOST;
const socket = io.connect(host);

socket.on('toPlayer1', () => {
  console.log('recieved from hub');
});

setTimeout( () => {
  socket.emit('fromPlayer1');
}, 2000);
// setInterval( () => {
//   socket.emit('fromPlayer1');
// }, 2000);