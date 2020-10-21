'use strict';

require('dotenv').config();

const server = require('./hub.js');
const PORT = process.env.PORT || 3000;

server.start(PORT);