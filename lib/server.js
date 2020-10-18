'use strict';

const express = require('express');

const app = express();
app.use(express.urlencoded({extended: true}));


module.exports = { 
  app,
  start:(port) => app.listen(port, console.log('listening on ', port))};