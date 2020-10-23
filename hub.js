'use strict';

/** 3rd party dependencies */
require('dotenv').config();
const io = require('socket.io')(3000); // Connected to whichever server is hosting events

/** Primary game namespace */
// const gameRoom = io.of('/gameroom');

/** Global connection to client that immediatley adds incoming sockets (clients) to their own game room. No namespace implementation is used. */
io.on('connect', socket => {

  socket.on('test', msg => {
    console.log(msg);
  });

  socket.on('get-user-info', payload => {
    console.log(`${payload.username} has connected to room ${payload.room}`);
    socket.join(payload.room);
    let rooms = Object.keys(io.sockets.adapter.rooms);
    console.log('rooms', rooms);
  });

  // socket.on('create-new-room', room => {
  //   socket.join('room1');
  //   console.log(io.sockets.adapter.rooms);
  //   // gameRoom.emit('room-list')
  //   gameLog('create-new-room', room);
  // });

  // function getRooms() {
  //   let allRooms = [];
  //   let rooms = io.sockets.adapter.rooms;
  //   allRooms.push(rooms);
  //   return allRooms;
  // };

  // socket.on('get-player-username', answer => {
  //   console.log(answer);
  //   socket.id = answer;
  //   console.log(io.sockets.adapter.rooms);
  //   gameLog('get-player-username', socket.id)
  //   socket.broadcast.emit('ready-player-1', `${socket.id} is ready to play!`);
  // });

});

function gameLog(event, payload){
  const timestamp = new Date().toTimeString().split(' ')[0];
  console.log('TICK', { timestamp, event, payload } );
};



/* 

BASIC TURN ORDER

1. players joins a game
2. game starts
3. players roll for turn order
4. P1 kicks down door
5. Is it a monster? 
  i. combat starts
  ii. if P1 can beat monster:
    a. P1 level++
    b. P1 recieves treasure
    c. P1 can play any applicable cards
  iii. if P1 can't beat monster
    a. ask for help (stretch goal)
    b. roll d6 to run away
      1. if roll succeeds, P1 turn is over
      2. if roll fails, P1 loses combat
      3. resolve any bad stuff
6. Is it a curse?
  i. curse effect applies to P1 immediately
  ii. P1 can look for trouble or loot the room (see below)
7. Is it neither?
  i. P1 can look for trouble
    a. play monster from your hand, standard combat rules apply
  ii. P1 can loot the room
    a. face down door card goes into P1s hand
8. P1 plays any applicable cards i.e. equipment, curses against other players etc
9. P1 turn is over, P2 turn start
10. Repeat from step 1

*/
 




