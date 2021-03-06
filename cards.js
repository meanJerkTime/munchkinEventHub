'use strict';

let cards = [
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


let doorCards = [
  {
    name: 'Fire',
    type: 'armour',
    description: '+6 against warriors.',
    badStuff: 'You become a normal, boring Human. Discard any race or class cards in play.',
    level: 0,
    armour: -2,
    weapon: 0,
  },
  {
    name: 'Plutonium Stick',
    type: 'weapon',
    description: 'Will not pursue anyone of level 5 or below.',
    badStuff: 'You are roasted and eaten. You are dead.',
    level: -1,
    armour: 0,
    weapon: 0,
  },
  {
    name: 'Stoned Golem',
    type: 'monster',
    description: 'You may choose whether to fight the Stoned Golem or just wave, walk past him, and let him keep his treasure. Halflings must fight.',
    badStuff: 'He has the munchies. He eats you. Youre dead.',
    level: +5,
    armour: +2,
    weapon: +3
  },
  {
    name: 'Shrieking Geek',
    type: 'armour',
    description: '+6 against warriors.',
    badStuff: 'You become a normal, boring Human. Discard any race or class cards in play.',
    level: +1,
    armour: +2,
    weapon: +3
  },
  {
    name: 'Plutonium Dragon',
    type: 'weapon',
    description: 'Will not pursue anyone of level 5 or below.',
    badStuff: 'You are roasted and eaten. You are dead.',
    level: +3,
    armour: +2,
    weapon: +3
  },
  {
    name: 'Health Bar',
    type: 'monster',
    description: 'You may choose whether to fight the Stoned Golem or just wave, walk past him, and let him keep his treasure. Halflings must fight.',
    badStuff: 'He has the munchies. He eats you. Youre dead.',
    level: +5,
    armour: +2,
    weapon: +3
  },
  {
    name: 'Stoned Golem',
    type: 'monster',
    description: 'You may choose whether to fight the Stoned Golem or just wave, walk past him, and let him keep his treasure. Halflings must fight.',
    badStuff: 'He has the munchies. He eats you. Youre dead.',
    level: +1,
    armour: +2,
    weapon: +3
  },
  {
    name: 'Cloth Boots',
    type: 'monster',
    description: 'You may choose whether to fight the Stoned Golem or just wave, walk past him, and let him keep his treasure. Halflings must fight.',
    badStuff: 'He has the munchies. He eats you. Youre dead.',
    level: +5,
    armour: +1,
    weapon: +3
  },
  {
    name: 'Thunder Strike',
    type: 'monster',
    description: 'You may choose whether to fight the Stoned Golem or just wave, walk past him, and let him keep his treasure. Halflings must fight.',
    badStuff: 'He has the munchies. He eats you. Youre dead.',
    level: +2,
    armour: +0,
    weapon: +6
  },
];



module.exports = doorCards;