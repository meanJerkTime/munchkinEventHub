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
  
  
  socket.on('fromClient', () => {
    console.log(socket.id, 'Connected');
      socket.emit('toClient');
  });
  // on create room also joins the room
  socket.on('createRoom', function(room) {
    socket.join(room);
    console.log(socket.id, 'joined Room', room);
  });
  // joins the room
  socket.on('signUp', function(user) {
    superagent.post('https://munchkin-401-server.herokuapp.com/signup')
      .send({username:user.userName, password:user.password})
      .set('X-API-Key', 'foobar')
      .set('accept', 'json')
      .end((err, res) => {
      });
    console.log(user);

  });
  
});
 

app.use(express.urlencoded({extended:true}));

function start(port) {
    http.listen(port, () => console.log('server up on port', port)); 
}

module.exports = {
    start:start
}

