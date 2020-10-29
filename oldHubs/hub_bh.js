'use strict';
require('dotenv').config();

const superagent = require('superagent');
const doorCards = require('../cards.js')
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Player = require('../lib/player.js');
const Monster = require('../lib/card-library/monster.js');
const Treasure = require('../lib/card-library/treasure.js');
const Curse = require('../lib/card-library/curse.js');
const DoorMisc = require('../lib/card-library/door-misc.js');

app.use(express.urlencoded({extended:true}));

let playerNum = 1;
let turn = 0;
var randomCards=[]

let players = []; 


io.on('connection', (socket) => {
  console.log(socket.id, 'Connected');


  socket.on('fromPlayer', () => {
    console.log(socket.id, 'Connected');
      socket.emit('toPlayer');
  });

for(let i = 0; i = randomCards.length; i++){
    randomCards.pop();
}

var n;
for (n=1; n<=3; ++n){
var i = Math.floor((Math.random() * 6));
randomCards.push(doorCards[i]);
doorCards[i] = doorCards[doorCards.length-n];
 }

  
  players.push(socket.id);
  
  console.log(players, 'connected');
      const player = socket.id;
  
      io.to(player).emit('cards', randomCards);
    
      console.log(socket.id, 'is player', playerNum++);
      if(players.length === 1) {
          io.to(player).emit('playerTurn');
      }
      else if (players.length !== 1) {
        io.to(player).emit('player', 'Please wait to play your hand!');
      }

  socket.on('nextPlayer', () => {
      turn++;
      if(turn === players.length) {
          turn = 0;
      }
      console.log(players[turn]);
      console.log(turn);
      io.to(players[turn]).emit('playerTurn');
  })  
  
  socket.on('winner', () => {
    socket.emit('winnerWinner', 'You WON!!');
  });

  socket.on('disconnect', () => {
    console.log('player', socket.id, 'disconnected');
    players = players.filter(player => player !== socket.id);
    console.log(players);
  })



})
 

function start(port) {
  http.listen(port, () => console.log('server up on port', port)); 
}

module.exports = {
  start:start
}