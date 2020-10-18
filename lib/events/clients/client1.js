'use strict';

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');
const gameRoomConnection = io.connect('http://localhost:3000/gameroom');

socket.emit('client1', 'client 1');

gameRoomConnection.on('hi', (id) => {
  //console.log('client 2 connected to game room');
  console.log(id);

});

gameRoomConnection.on('connected', payload =>{
  console.log(payload);
});




// function Game
/*
- When a clients connects we need a list of namespaces
*/

/*
- We need to be able to join a namespace or create one
*/

/*
- We need a copy of DB treasure/door cards to be shuffle in to the namespace 
*/

/*
- We need 4 treasure and 4 door cards
*/
