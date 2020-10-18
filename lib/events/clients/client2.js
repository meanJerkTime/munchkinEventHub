'use strict';

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');
const gameRoomConnection = io.connect('http://localhost:3000/gameroom');

socket.emit('client2', 'client 2');

gameRoomConnection.on('hi', (id) => {
  //console.log('client 2 connected to game room');
  console.log(id);

});

gameRoomConnection.on('connected', payload =>{
  console.log(payload);
});