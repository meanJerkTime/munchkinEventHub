'use strict';

require('dotenv').config();

const server = require('./hub_bh.js');
const PORT = process.env.PORT || 5000;

server.start(PORT);