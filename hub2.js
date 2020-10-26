'use strict';
require('dotenv').config();

const superagent = require('superagent');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Player = require('./lib/player.js');
const Monster = require('./lib/card-library/monster.js');
const Treasure = require('./lib/card-library/treasure.js');
const Curse = require('./lib/card-library/curse.js');
const DoorMisc = require('./lib/card-library/door-misc.js');
const { request } = require('http');
const { response } = require('express');

app.use(express.urlencoded({extended:true}));

let players = []; 
let playerNum = 1;
let turn = 0;

io.on('connection', (socket) => {
  console.log(socket.id, 'Connected');

  players.push(socket.id);
  
  console.log(players, 'connected');
      const player = socket.id;
      io.to(player).emit('player', `player${playerNum}`);

      console.log(socket.id, 'is player', playerNum++);
      if(players.length === 1) {
          io.to(player).emit('playerTurn');
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

  socket.on('disconnect', () => {
    console.log('player', socket.id, 'disconnected');
    players = players.filter(player => player !== socket.id);
    console.log(players);
  })

  
  socket.on('fromPlayer', () => {
    console.log(socket.id, 'Connected');
      socket.emit('toPlayer');
  });





  // server sign up and sign in events
  socket.on('signIn', function(user) {
    // superagent.get('http://localhost:3000/signin')
    superagent.get('https://munchkin-401-server.herokuapp.com/signin')
    .send({username:user.userName, password:user.password})
    .set('X-API-Key', 'foobar')
    .set('accept', 'json')
    .end((err, res) => {
      if(res.body.user == undefined) {
        socket.emit('inValid');
        console.log('Invalid Login');
      } else {
        console.log(res.body.user, 'signed in');
        socket.emit('valid');
      }
    });

  });
  

  socket.on('signUp', function(user) {
    // superagent.post('http://localhost:3000/signup')
    superagent.post('https://munchkin-401-server.herokuapp.com/signup')
      .send({username:user.userName, password:user.password})
      .set('X-API-Key', 'foobar')
      .set('accept', 'json')
      .end((err, res) => {
      });
      console.log(user.userName, 'signed up');

  });





})

function gameLog(event, payload, other){
//   const timestamp = new Date().toTimeString().split(' ')[0];
//   console.log('TICK', { timestamp, event, payload, other } );
};

function openRooms(event){
  let rooms = io.sockets.adapter.rooms
//   console.log('ROOMS:', {event, rooms});
    // console.log(io.sockets.adapter.rooms);
}


let doorCards = [
  {
    name: 'Large Angry Chicken',
    type: 'monster',
    description: 'Fried chicken is delicious. Gain an EXTRA level if you defeat it with fire or flame.',
    badStuff: 'Very painful pecking. Lose a level.',
    treasures: 1,
    monsterLevel: 2,
    bonusLevel: null,
    winLevel: 1,
    loseLevel: 1,
    monsterBonus: null,
  },
  {
    name: 'Cleric',
    type: 'playerClass',
    description: 'When its time for you to draw cards face-up, you may draw from the appropriate discard pile. You must then discard one card from your hand for each card so drawn. You may discard up to 3 cards in combat against an Undead creature. Each card gives you +3 bonus points.',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: null,
    winLevel: null,
    loseLevel: null,
    monsterBonus: null,
  },
  {
    name: 'Warrior',
    type: 'playerClass',
    description: 'You may discard up to 3 cards in combat, each one gives you a +1 bonus. You win ties in combat.',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: null,
    winLevel: null,
    loseLevel: null,
    monsterBonus: null,
  },
  {
    name: 'Elf',
    type: 'playerClass',
    description: '+1 to run away. You go up a level for every monster you help someone else kill.',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: null,
    winLevel: null,
    loseLevel: null,
    monsterBonus: null,
  },
  {
    name: 'Curse! Lose 1 small item.',
    type: 'curse',
    description: 'Choose 1 small item to discard. Any item that is not designated Big is small.',
    badStuff: 'Lose 1 small item.',
    treasures: null,
    monsterLevel: null,
    bonusLevel: null,
    winLevel: null,
    loseLevel: null,
    monsterBonus: null,
  },
  {
    name: 'Dwarf',
    type: 'playerClass',
    description: 'You can carry any number of Big items. You can have 6 cards in your hand.',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: null,
    winLevel: null,
    loseLevel: null,
    monsterBonus: null,
  },
  {
    name: 'Curse! Lose 2 cards',
    type: 'curse', 
    description: 'Discard 2 cards.',
    badStuff: 'Lose 2 cards.',
    treasures: null,
    monsterLevel: null,
    bonusLevel: null,
    winLevel: null,
    loseLevel: null,
    monsterBonus: null,
  },
  {
    name: 'Plutonium Dragon',
    type: 'monster',
    description: 'Will not pursue anyone of level 5 or below.',
    badStuff: 'You are roasted and eaten. You are dead.',
    treasures: 5,
    monsterLevel: 20,
    bonusLevel: null,
    winLevel: 1,
    loseLevel: 'playerLevel',
    monsterBonus: null,
  },
  {
    name: 'Stoned Golem',
    type: 'monster',
    description: 'You may choose whether to fight the Stoned Golem or just wave, walk past him, and let him keep his treasure. Halflings must fight.',
    badStuff: 'He has the munchies. He eats you. Youre dead.',
    treasures: 4,
    monsterLevel: 14,
    bonusLevel: null,
    winLevel: 1,
    loseLevel: 'playerLevel',
    monsterBonus: null,
  },
  {
    name: 'Shrieking Geek',
    type: 'monster',
    description: '+6 against warriors.',
    badStuff: 'You become a normal, boring Human. Discard any race or class cards in play.',
    treasures: 2,
    monsterLevel: 6,
    bonusLevel: null,
    winLevel: 1,
    loseLevel: null,
    monsterBonus: 6,
  },
];
 

function start(port) {
  http.listen(port, () => console.log('server up on port', port)); 
}

module.exports = {
  start:start
}