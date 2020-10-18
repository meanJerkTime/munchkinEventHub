'use strict';

const io = require('socket.io')(3000);
const gameRoom = io.of('/gameroom');

let custom_id = 0;
io.engine.generateId = (req) => {
  return "custom:id:" + custom_id++; // custom id must be unique
}


io.on('connection', socket => {
  //console.log(`connected to ${socket.id}`);
  socket.on('client1', payload => {
    console.log(payload, socket.id);
  });

  socket.on('client2', payload => {
    console.log(payload, socket.id);
  });
  
  socket.on('client3', payload => {
    console.log(payload, socket.id);
  });
});
gameRoom.on('connection', socket => {
  //console.log(socket.id,'joined the room');
  gameRoom.emit('hi', socket.id);
  socket.on('connected', (payload) =>{
    gameRoom.emit('connected', payload);
  });
});


 




