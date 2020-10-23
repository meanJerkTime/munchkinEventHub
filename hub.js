'use strict';
require('dotenv').config();
const superagent = require('superagent');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


/** Built-in method of socket.io engine to overwrite default socket ID and create a custom ID for all connected sockets */
let custom_id = 0;
io.engine.generateId = (req) => {
  return "User:" + custom_id + Math.floor(Math.random() * 10000);
};

io.on('connection', (socket) => {
  
  
  socket.on('fromPlayer', () => {
    console.log(socket.id, 'Connected');
      socket.emit('toPlayer');
  });


  socket.on('signIn', function(user) {
    // superagent.post('http://localhost:3000/signin')
    superagent.post('https://munchkin-401-server.herokuapp.com/signup')
    .send({username:user.userName, password:user.password})
    .set('X-API-Key', 'foobar')
    .set('accept', 'json')
    .end((err, response) => {
      if(response.body.user == undefined) {
        console.log('Invalid Login');
      } else {
        console.log(response.body.user, 'signed in');
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
});
 

app.use(express.urlencoded({extended:true}));

function start(port) {
    http.listen(port, () => console.log('server up on port', port)); 
}

module.exports = {
    start:start
}

