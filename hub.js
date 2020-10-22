'use strict';

/** 3rd party dependencies */
require('dotenv').config();
const io = require('socket.io')(3000); // <-- Connected to whichever server is hosting events

/** Primary game namespace */
const gameRoom = io.of('/gameroom');

/** Built-in method of socket.io engine to overwrite default socket ID and create a custom ID for all connected sockets */
let custom_id = 0;
io.engine.generateId = (req) => {
  return "User:" + custom_id + Math.floor(Math.random() * 10000);
};

io.on('connect', (socket) => {
  
  socket.on('fromClient', () => {
    console.log(socket.id, 'Connected');
      socket.emit('toClient');
  });
  socket.on('answers', (payload) => {
    // console.log(payload.roomsList);
  });

  // on create room also joins the room
  socket.on('createRoom', function(room) {
    socket.join(room);
    console.log(socket.id, 'joined Room', room);
  });
  // joins the room
  socket.on('joinRoom', function(room) {
    socket.join(room);
    // console.log(socket.id, 'joined Room', room);
  });
  console.log(socket.adapter.rooms);
});

/* Card decks */
let treasureCards = [
  {
    name: 'Boil An Anthill',
    type: item,
    description: 'Go Up A Level!',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: null,
    winLevel: 1,
    loseLevel: null,
  },
  {
    name: 'Pretty Balloons',
    type: item,
    description: 'Use during combat, for distraction. +5 to either side. Usable once only.',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: 5,
    winLevel: null,
    loseLevel: null,
  },
  {
    name: 'Spiky Knees',
    type: gear,
    description: '+1 bonus',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: 1,
    winLevel: null,
    loseLevel: null,
  },
  {
    name: 'Really Impressive Title',
    type: item,
    description: '+3 bonus',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: 3,
    winLevel: null,
    loseLevel: null,
  },
  {
    name: 'Boots of Butt-Kicking',
    type: gear,
    description: '+2 bonus',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: 2,
    winLevel: null,
    loseLevel: null,
  },
  {
    name: 'Sneaky Bastard Sword',
    type: gear,
    description: '+2 bonus',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: 2,
    winLevel: null,
    loseLevel: null,
  },
  {
    name: 'Flaming Armor',
    type: gear,
    description: '+2 bonus',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: 2,
    winLevel: null,
    loseLevel: null,
  },
  {
    name: 'Helm of Courage',
    type: gear,
    description: '+1 bonus',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: 1,
    winLevel: null,
    loseLevel: null,
  },
  {
    name: 'Rat On A Stick',
    type: gear,
    description: 'Hey, its better than nothing! You may discard this item, even if youre only carrying it, for an automatic escape from any monster of Level 8 or below. +1 bonus.',
    badStuff: null,
    treasures: null,
    monsterLevel: null,
    bonusLevel: 1,
    winLevel: null,
    loseLevel: null,
  },
  {
    name: 'Intelligent',
    type: item,
    description: 'Play during combat. If the monster is defeated, draw one extra treasure.',
    badStuff: null,
    treasures: 1,
    monsterLevel: null,
    bonusLevel: null,
    winLevel: null,
    loseLevel: null,
    monsterBonus: 5,
  }
];
let doorCards = [
  {
    name: 'Large Angry Chicken',
    type: monster,
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
    type: playerClass,
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
    type: playerClass,
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
    type: playerClass,
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
    type: curse,
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
    type: playerClass,
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
    type: curse, 
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
    type: monster,
    description: 'Will not pursue anyone of level 5 or below.',
    badStuff: 'You are roasted and eaten. You are dead.',
    treasures: 5,
    monsterLevel: 20,
    bonusLevel: null,
    winLevel: 1,
    loseLevel: playerLevel,
    monsterBonus: null,
  },
  {
    name: 'Stoned Golem',
    type: monster,
    description: 'You may choose whether to fight the Stoned Golem or just wave, walk past him, and let him keep his treasure. Halflings must fight.',
    badStuff: 'He has the munchies. He eats you. Youre dead.',
    treasures: 4,
    monsterLevel: 14,
    bonusLevel: null,
    winLevel: 1,
    loseLevel: playerLevel,
    monsterBonus: null,
  },
  {
    name: 'Shrieking Geek',
    type: monster,
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
 




