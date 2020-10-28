'use strict';
require('dotenv').config();

const superagent = require('superagent');
const doorCards = require('./cards.js')
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Player = require('./lib/player.js');
const Monster = require('./lib/card-library/monster.js');
const Treasure = require('./lib/card-library/treasure.js');
const Curse = require('./lib/card-library/curse.js');
const DoorMisc = require('./lib/card-library/door-misc.js');

app.use(express.urlencoded({extended:true}));

let playerNum = 1;
let turn = 0;
let players = []; 


io.on('connection', (socket) => {
  console.log(socket.id, 'Connected');
    socket.emit('login');
  //    socket.on('fromPlayer', () => {
  //       console.log(socket.id, 'Connected');
  //       socket.emit('toPlayer');
  // });

     players.push(socket.id);
  
      const player = socket.id;
    
      console.log(socket.id, 'is player', playerNum++);
      if(players.length === 1) {
          // io.to(player).emit('playerTurn');
          socket.on('game', () => {
            io.to(player).emit('playerTurn');
          })

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
  
    socket.on('disconnect', () => {
        console.log('player', socket.id, 'disconnected');
        players = players.filter(player => player !== socket.id);
        console.log(players);
    })

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

    socket.on('hand-has-been-played', payload => {

    
        // pull one card from door deck at random
        let card = new Monster(1, 'Weak Monster', 1, 1);
    
        socket.emit('kick-down-door', payload, card);
    
      });

      socket.on('new-munchkin', (payload) => {

    
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
        
        socket.emit('play-hand', payload);
    
    
      });

      socket.on('create-room', payload => {

        console.log(`${payload.username} has connected to room ${payload.room}`);
    
        
        socket.join(payload.room);
    
        let p1 = new Player();
    
        socket.emit('add-new-player', payload.username, p1);
    
    
      });

      

    })
 

function start(port) {
  http.listen(port, () => console.log('server up on port', port)); 
}

module.exports = {
  start:start
}