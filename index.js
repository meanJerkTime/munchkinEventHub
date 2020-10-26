'use strict';

require('dotenv').config();

const server = require('./hub2.js');
const PORT = process.env.PORT || 5000;

server.start(PORT);