"use strict"

const winston = require('winston');
// (winston.Logger) -> require('winston/logger').Logger
// That's why is in ()
const logger = new (winston.Logger)({
  transports: [
    // new (winston.transports.File)({
    //   level: 'debug',
    //   filename: './chatCatDebug.log',
    //   handleExceptions: true
    // }),
    new (winston.transports.Console)({
      level: 'debug',
      json: true,
      handleExceptions: true
    })
  ],
  exitOnError: false,
});

module.exports = logger;
