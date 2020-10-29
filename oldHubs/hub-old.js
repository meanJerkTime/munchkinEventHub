'use strict';
require('dotenv').config();
const io = require('socket.io')(3000); // Connected to whichever server is hosting events

/** Custom modules */
const Player = require('../lib/player.js');
const Monster = require('../lib/card-library/monster.js');
const Treasure = require('../lib/card-library/treasure.js');
const Curse = require('../lib/card-library/curse.js');
const DoorMisc = require('../lib/card-library/door-misc.js');
const { request } = require('http');
const { response } = require('express');

/** Primary game namespace */
// const gameRoom = io.of('/gameroom'); // not currently in use
let players = [];
let playerNum = 1;
let turn = 0;
/** Global connection to client that immediatley adds incoming sockets (clients) to their own game room. No namespace implementation is used. Might add namespace implementation in the future.*/

io.on('connection', (socket) => {
  console.log(socket.id, 'Connected');

  players.push(socket.id);

  socket.on('disconnect', () => {
    console.log('player', socket.id, 'disconnected');
    players = players.filter(player => player !== socket.id);
    console.log(players);
  })
  console.log(players);

  
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
    })

  socket.on('create-room', payload => {

    console.log(`${payload.username} has connected to room ${payload.room}`);

    gameLog('create-room', payload);
    
    // socket.join(payload.room); // will be implemented in the future

    let player = new Player();
    
    let roomData = {
      roomID: payload.room,
      userID: socket.id,
    };
    
    let playerData = {
      create: payload.create,
      roomData,
      username: payload.username,
      player, 
    };

    const user = socket.id;
    if( players.length === 1 ) {
      io.to(user).emit('player-turn');
    } else if ( players.length !== 1 ) {
      io.to(user).emit('player', 'please wait to play your turn', payload);
    };
  })

    socket.on('next-player', () => {
      turn++;
      if ( turn === players.length ) {
        turn = 0;
      };
      io.to(players[turn]).emit('player-turn');

    });

    players.push(playerData);
    // console.log(playerData);
    socket.emit('add-new-player', playerData);

    openRooms('create-room');

  });

  // socket.on('create-or-join', payload => {

  //   let players = [];

  //   console.log(`${payload.username} created and joined the room ${payload.room}`);

  //   gameLog('create-or-join', payload);

  //   socket.join(payload.room);

    // let roomData = {
    //   roomID: payload.room,
    //   userID: socket.id,
    // };

    // players.push(roomData);

    // let playerData = {
    //   playerList: players,
    //   roomData,
    //   username: payload.username,
    //   player: new Player(),
    // };

  //   // check to see if client is connect to the room. 
  //   if ( io.sockets.adapter.sids[socket.id][payload.room] ) {
  //     socket.emit('add-new-player', playerData);
  //   };

  //   openRooms('create-or-join');

  // });

  socket.on('join-room', () => {

    let rooms = Object.keys(io.sockets.adapter.rooms);
    console.log('room list', rooms);
    rooms.splice(0, io.engine.clientsCount);
    socket.emit('get-room-list', rooms);

    gameLog('join-room', 'no payload');

    openRooms('join-room');

  });

  socket.on('has-joined-room', payload => {

    console.log(`${payload.username} has connected to room ${payload.joinedRoom}`);
    socket.broadcast.emit('new-player-joins-room', `${payload.username} has connected to room ${payload.joinedRoom}`);

    gameLog('has-joined-room', payload);
   
    // socket.join(payload.room);

    let roomData = {
      roomID: payload.room,
      userID: socket.id,
    };

    let playerData = {
      roomData,
      username: payload.username,
      player: new Player(),
    };

    players.push(playerData);
    socket.emit('add-new-player', playerData);

    openRooms('has-joined-room');

  });

  socket.on('new-munchkin', (payload) => {

    gameLog('new-munchkin', payload);

    // randomly pull 4 door cards and 4 treasure cards and add them to palyer hand
    // if player.dead = true
      // only deal 2 door cards and 2 treasure cards
    let d1 = new Monster(1, 'scary monster', 1, 1);
    let d2 = new Monster(1, 'big monster', 1, 1);
    let d3 = new Monster(1, 'small monster', 1, 1);
    let d4 = new Monster(1, 'mad monster', 1, 1);
    let t1 = new Treasure('loot', 2, 'helm');
    let t2 = new Treasure('loot', 3, 'armor');
    let t3 = new Treasure('loot', 1, 'boots');
    let t4 = new Treasure('loot', 4, 'sword');

    // initial 8 cards a player is dealt at start of game
    let initialDeal = [
      d1,
      d2,
      d3,
      d4,
      t1,
      t2,
      t3,
      t4,
    ];

    payload.player.hand = initialDeal;
    
    socket.emit('add-to-queue', payload);
    if (payload.create) {
      socket.emit('play-hand', payload);
    } else {
      socket.emit('not-your-turn', payload);
    };

    openRooms('new-munchkin');

  });

  socket.on('hand-has-been-played', payload => {

    gameLog('hand-has-been-played', payload);

    // pull one card from door deck at random
    let card = new Monster(1, 'Weak Monster', 1, 1);

    socket.emit('kick-down-door', payload, card);

  });

  socket.on('combat-ended', (payload, card) => {

    gameLog('combat-ended', payload, card);

    // pull (n) number of cards from treasure deck where (n) is card.treasures
    // let treasure = new Treasure('consumable', 3, 'power potion')
    payload.player.hand.push(new Treasure('consumable', 3, 'power potion'));
    console.log(payload.player.hand);

    openRooms('combat-ended');

  });

  socket.on('turn-over', (payload) => {

    socket.emit('not-your-turn', payload);
    console.log(players);

    if (players.length > 0) {
      let nextPlayer = players.shift();
      players.push(nextPlayer);
      if (players.length > 1) {
        socket.to(nextPlayer.roomData.userID).emit('play-hand', nextPlayer);
      } else {
        socket.emit('play-hand', payload);
      };
    };

  });

  openRooms('global');

});


function gameLog(event, payload, other){
  const timestamp = new Date().toTimeString().split(' ')[0];
  console.log('TICK', { timestamp, event, payload, other } );
};

function openRooms(event){
  let rooms = io.sockets.adapter.rooms
}
  console.log('OPEN ROOMS', {event, rooms});


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
 

function openRooms(event){
  let rooms = io.sockets.adapter.rooms
  console.log('OPEN ROOMS', {event, rooms});
}

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

/** temp card laibrary */
// let door = doorCards[Math.floor(Math.random() * doorCards.length)]; // get random card


function start(port) {
  http.listen(port, () => console.log('server up on port', port)); 
}

module.exports = {
  start:start
}